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
} from 'lucide-react';

import CustomInput from '../components/CustomInput';
import provinciasData from '../components/Provincias.json'
import { useProdutoresAprovados } from '../hooks/useRnpaData';

const CertificacaoProdutorFlorestal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [produtorSelecionado, setProdutorSelecionado] = useState(null);
  const [modoBusca, setModoBusca] = useState(true);

  // Hook para buscar produtores aprovados
  const { produtor: produtoresAprovados, loading: loadingProdutores } = useProdutoresAprovados();

  // Estados para as tabelas dinâmicas
  const [areasFlorestais, setAreasFlorestais] = useState([]);
  const [especiesAutorizadas, setEspeciesAutorizadas] = useState([]);
  const [historicoExploracoes, setHistoricoExploracoes] = useState([]);

  // Estado inicial do formulário
  const initialState = {
    nomeCompleto: '',
    nomeEmpresa: '',
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
    tipoLicenca: '',
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
    { label: 'Identificação', icon: Search },
    { label: 'Dados Pessoais', icon: User },
    { label: 'Dados da Empresa', icon: Building },
    { label: 'Áreas Florestais', icon: Trees },
    { label: 'Espécies Autorizadas', icon: Mountain },
    { label: 'Histórico de Exploração', icon: Activity },
    { label: 'Licença Florestal', icon: Award }
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

    console.log('🔍 Validando step florestal:', activeIndex);
    console.log('📋 FormData atual:', formData);

    // switch (activeIndex) {
    //   case 0: // Identificação
    //     if (modoBusca) {
    //       if (!produtorSelecionado) {
    //         newErrors.produtorSelecionado = 'Selecione um produtor existente';
    //       }
    //     } else {
    //       if (!hasValidValue(formData.nomeCompleto)) {
    //         newErrors.nomeCompleto = 'Campo obrigatório';
    //       }
    //       if (!hasValidValue(formData.bi)) {
    //         newErrors.bi = 'Campo obrigatório';
    //       }
    //     }
    //     break;

    //   case 1: // Dados Pessoais
    //     if (!hasValidValue(formData.nomeCompleto)) {
    //       newErrors.nomeCompleto = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.bi)) {
    //       newErrors.bi = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.telefone)) {
    //       newErrors.telefone = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.provincia)) {
    //       newErrors.provincia = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.municipio)) {
    //       newErrors.municipio = 'Campo obrigatório';
    //     }
    //     break;

    //   case 2: // Dados da Empresa
    //     if (!hasValidValue(formData.nomeEmpresa)) {
    //       newErrors.nomeEmpresa = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.numeroLicencaExploracao)) {
    //       newErrors.numeroLicencaExploracao = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.tipoLicenca)) {
    //       newErrors.tipoLicenca = 'Campo obrigatório';
    //     }
    //     break;

    //   case 3: // Áreas Florestais
    //     if (areasFlorestais.length === 0) {
    //       newErrors.areasFlorestais = 'Adicione pelo menos uma área florestal';
    //     }
        
    //     areasFlorestais.forEach((item, index) => {
    //       if (!item.nomeArea) {
    //         newErrors[`areaFlorestal_${index}_nome`] = `Nome da área é obrigatório na linha ${index + 1}`;
    //       }
    //       if (!item.areaHectares || parseFloat(item.areaHectares) <= 0) {
    //         newErrors[`areaFlorestal_${index}_area`] = `Área deve ser maior que zero na linha ${index + 1}`;
    //       }
    //       if (!item.localizacao) {
    //         newErrors[`areaFlorestal_${index}_localizacao`] = `Localização é obrigatória na linha ${index + 1}`;
    //       }
    //     });
    //     break;

    //   case 4: // Espécies Autorizadas
    //     if (especiesAutorizadas.length === 0) {
    //       newErrors.especiesAutorizadas = 'Adicione pelo menos uma espécie autorizada';
    //     }
        
    //     especiesAutorizadas.forEach((item, index) => {
    //       if (!item.especie) {
    //         newErrors[`especie_${index}_nome`] = `Nome da espécie é obrigatório na linha ${index + 1}`;
    //       }
    //       if (!item.volumeAutorizado || parseFloat(item.volumeAutorizado) <= 0) {
    //         newErrors[`especie_${index}_volume`] = `Volume deve ser maior que zero na linha ${index + 1}`;
    //       }
    //     });
    //     break;

    //   case 5: // Histórico de Exploração
    //     // Histórico é opcional, mas se existir deve ter campos válidos
    //     historicoExploracoes.forEach((item, index) => {
    //       if (item.ano || item.especie || item.volumeExplorado) {
    //         if (!item.ano) {
    //           newErrors[`historico_${index}_ano`] = `Ano é obrigatório na linha ${index + 1}`;
    //         }
    //         if (!item.especie) {
    //           newErrors[`historico_${index}_especie`] = `Espécie é obrigatória na linha ${index + 1}`;
    //         }
    //       }
    //     });
    //     break;

    //   case 6: // Licença Florestal
    //     if (!hasValidValue(formData.validadeInicio)) {
    //       newErrors.validadeInicio = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.validadeFim)) {
    //       newErrors.validadeFim = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.tecnicoResponsavel)) {
    //       newErrors.tecnicoResponsavel = 'Campo obrigatório';
    //     }
    //     if (!hasValidValue(formData.cargoTecnico)) {
    //       newErrors.cargoTecnico = 'Campo obrigatório';
    //     }
        
    //     // Validar datas
    //     const dataInicio = getDisplayValue(formData.validadeInicio);
    //     const dataFim = getDisplayValue(formData.validadeFim);
        
    //     if (dataInicio && dataFim) {
    //       const inicio = new Date(dataInicio);
    //       const fim = new Date(dataFim);
          
    //       if (fim <= inicio) {
    //         newErrors.validadeFim = 'Data final deve ser posterior à data inicial';
    //       }
    //     }

    //     // Validar se há pelo menos uma área florestal e uma espécie
    //     if (areasFlorestais.length === 0) {
    //       newErrors.areasFlorestaisGeral = 'É necessário ter pelo menos uma área florestal registrada';
    //     }
    //     if (especiesAutorizadas.length === 0) {
    //       newErrors.especiesAutorizadasGeral = 'É necessário ter pelo menos uma espécie autorizada';
    //     }
    //     break;
    // }

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

  const buscarProdutor = (produtorOption) => {
    const produtorId = typeof produtorOption === 'object' ? produtorOption.value : produtorOption;
    const produtor = produtoresAprovados.find(p => p._id === parseInt(produtorId));

    if (produtor) {
      setProdutorSelecionado(produtor);

      const nomeCompleto = [
        produtor.nome_produtor,
        produtor.nome_meio_produtor,
        produtor.sobrenome_produtor
      ].filter(Boolean).join(' ');

      setFormData(prev => ({
        ...prev,
        nomeCompleto: nomeCompleto,
        bi: produtor.beneficiary_id_number || '',
        telefone: produtor.beneficiary_phone_number || '',
        provincia: produtor.provincia || '',
        municipio: produtor.municipio || '',
        comuna: produtor.comuna || ''
      }));

      if (produtor.provincia) {
        const provinciaSelected = provinciasData.find(
          p => p.nome.toUpperCase() === produtor.provincia?.toUpperCase()
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

      if (errors.produtorSelecionado) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.produtorSelecionado;
          return newErrors;
        });
      }

      showToast('success', 'Produtor Encontrado', 'Dados preenchidos automaticamente!');
    }
  };

  const produtoresOptions = produtoresAprovados.map(p => {
    const nomeCompleto = [
      p.nome_produtor,
      p.nome_meio_produtor,
      p.sobrenome_produtor
    ].filter(Boolean).join(' ');

    return {
      label: `${nomeCompleto} - ${p.beneficiary_id_number}`,
      value: p._id.toString()
    };
  });

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
    
    if (errors.areasFlorestais) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.areasFlorestais;
        return newErrors;
      });
    }
  };

  const removerAreaFlorestal = (id) => {
    setAreasFlorestais(areasFlorestais.filter(item => item.id !== id));
  };

  const atualizarAreaFlorestal = (id, campo, valor) => {
    setAreasFlorestais(areasFlorestais.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
    
    const index = areasFlorestais.findIndex(item => item.id === id);
    if (index !== -1) {
      const errorKey = `areaFlorestal_${index}_${campo === 'nomeArea' ? 'nome' : campo === 'areaHectares' ? 'area' : 'localizacao'}`;
      if (errors[errorKey]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[errorKey];
          return newErrors;
        });
      }
    }
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
    
    if (errors.especiesAutorizadas) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.especiesAutorizadas;
        return newErrors;
      });
    }
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
      case 0: // Identificação
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação do Produtor Florestal</h3>
              </div>
              <p className="text-gray-600">
                Primeiro, vamos identificar se o produtor já está cadastrado no sistema ou se é um novo cadastro.
              </p>
            </div>

            {errors.produtorSelecionado && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.produtorSelecionado}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center space-x-4 mb-6">
                <button
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${modoBusca
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  onClick={() => {
                    setModoBusca(true);
                    setProdutorSelecionado(null);
                    setFormData(initialState);
                    setErrors({});
                  }}
                >
                  <Search size={18} className="mr-2 inline" />
                  Buscar Existente
                </button>
                <button
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${!modoBusca
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  onClick={() => {
                    setModoBusca(false);
                    setProdutorSelecionado(null);
                    setFormData(initialState);
                    setErrors({});
                  }}
                >
                  <Plus size={18} className="mr-2 inline" />
                  Novo Cadastro
                </button>
              </div>

              {modoBusca ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Buscar Produtor Existente</h4>

                  {loadingProdutores ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="animate-spin w-6 h-6 text-green-600 mr-2" />
                      <span className="text-gray-600">Carregando produtores...</span>
                    </div>
                  ) : (
                    <CustomInput
                      type="select"
                      label="Selecionar Produtor"
                      value=""
                      options={produtoresOptions}
                      onChange={(value) => buscarProdutor(value)}
                      placeholder="Selecione um produtor existente"
                      iconStart={<Search size={18} />}
                      errorMessage={errors.produtorSelecionado}
                    />
                  )}

                  {produtorSelecionado && (
                    <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <h5 className="font-semibold text-green-800">Produtor Selecionado</h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Nome:</strong> {formData.nomeCompleto}</div>
                        <div><strong>BI:</strong> {formData.bi}</div>
                        <div><strong>Telefone:</strong> {formData.telefone}</div>
                        <div><strong>Localização:</strong> {formData.provincia} - {formData.municipio}</div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Novo Produtor Florestal</h4>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 text-sm">
                      <Info size={18} className="inline mr-2" />
                      Preencha os dados básicos do novo produtor florestal. Os campos detalhados serão preenchidos nas próximas etapas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.nomeCompleto}
                      onChange={(value) => handleInputChange('nomeCompleto', value)}
                      required
                      errorMessage={errors.nomeCompleto}
                      placeholder="Digite o nome completo"
                      iconStart={<User size={18} />}
                    />

                    <CustomInput
                      type="text"
                      label="Número do Bilhete de Identidade"
                      value={formData.bi}
                      onChange={(value) => handleInputChange('bi', value)}
                      required
                      errorMessage={errors.bi}
                      placeholder="Digite o número do BI"
                      iconStart={<CreditCard size={18} />}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Dados Pessoais
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados Pessoais do Produtor</h3>
              </div>
              <p className="text-gray-600">
                Complete ou verifique as informações pessoais do produtor florestal.
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
                  disabled={produtorSelecionado !== null}
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
                  disabled={produtorSelecionado !== null}
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
                  disabled={produtorSelecionado !== null || !formData.provincia}
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
                  disabled={produtorSelecionado !== null}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Dados da Empresa
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados da Empresa/Licença</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a empresa e licença de exploração florestal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="text"
                  label="Nome da Empresa"
                  value={formData.nomeEmpresa}
                  onChange={(value) => handleInputChange('nomeEmpresa', value)}
                  required
                  errorMessage={errors.nomeEmpresa}
                  placeholder="Nome da empresa exploradora"
                  iconStart={<Building size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Número da Licença de Exploração"
                  value={formData.numeroLicencaExploracao}
                  onChange={(value) => handleInputChange('numeroLicencaExploracao', value)}
                  required
                  errorMessage={errors.numeroLicencaExploracao}
                  placeholder="Ex: DNF/2025/001"
                  iconStart={<FileText size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Tipo de Licença"
                  value={formData.tipoLicenca ? { label: formData.tipoLicenca, value: formData.tipoLicenca } : null}
                  options={[
                    { label: 'Licença de Exploração Florestal', value: 'EXPLORACAO_FLORESTAL' },
                    { label: 'Licença de Plantio Florestal', value: 'PLANTIO_FLORESTAL' },
                    { label: 'Licença de Manejo Florestal', value: 'MANEJO_FLORESTAL' },
                    { label: 'Licença de Reflorestamento', value: 'REFLORESTAMENTO' }
                  ]}
                  onChange={(value) => handleInputChange('tipoLicenca', typeof value === 'object' ? value.value : value)}
                  required
                  errorMessage={errors.tipoLicenca}
                  placeholder="Selecione o tipo de licença"
                  iconStart={<Trees size={18} />}
                />

                <CustomInput
                  type="number"
                  label="Área Total da Floresta (hectares)"
                  value={formData.areaFlorestaTotalHa}
                  onChange={(value) => handleInputChange('areaFlorestaTotalHa', value)}
                  placeholder="0.0"
                  iconStart={<Mountain size={18} />}
                />

                <div className="md:col-span-2">
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
              </div>
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

            {errors.areasFlorestais && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.areasFlorestais}
                  </p>
                </div>
              </div>
            )}

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
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`areaFlorestal_${index}_nome`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
                              placeholder="Nome da área..."
                            />
                            {errors[`areaFlorestal_${index}_nome`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`areaFlorestal_${index}_nome`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.areaHectares}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'areaHectares', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`areaFlorestal_${index}_area`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                            {errors[`areaFlorestal_${index}_area`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`areaFlorestal_${index}_area`]}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.localizacao}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'localizacao', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`areaFlorestal_${index}_localizacao`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
                              placeholder="Prov.-Munic.-Comuna"
                            />
                            {errors[`areaFlorestal_${index}_localizacao`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`areaFlorestal_${index}_localizacao`]}
                              </p>
                            )}
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

              {areasFlorestais.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Resumo das Áreas Florestais</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-green-600">
                        {areasFlorestais.reduce((acc, item) => acc + (parseFloat(item.areaHectares) || 0), 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">Total Área (ha)</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-blue-600">
                        {areasFlorestais.length}
                      </span>
                      <span className="text-gray-600">Áreas Registradas</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-purple-600">
                        {new Set(areasFlorestais.map(item => item.tipoFloresta).filter(Boolean)).size}
                      </span>
                      <span className="text-gray-600">Tipos de Floresta</span>
                    </div>
                  </div>
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

            {errors.especiesAutorizadas && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.especiesAutorizadas}
                  </p>
                </div>
              </div>
            )}

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
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`especie_${index}_nome`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
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
                            {errors[`especie_${index}_nome`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`especie_${index}_nome`]}
                              </p>
                            )}
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
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`especie_${index}_volume`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                            {errors[`especie_${index}_volume`] && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors[`especie_${index}_volume`]}
                              </p>
                            )}
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

              {especiesAutorizadas.length > 0 && (
                <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                  <h5 className="font-semibold text-amber-800 mb-2">Resumo das Espécies Autorizadas</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-amber-600">
                        {especiesAutorizadas.reduce((acc, item) => acc + (parseFloat(item.volumeAutorizado) || 0), 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">Volume Total Autorizado</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-green-600">
                        {especiesAutorizadas.length}
                      </span>
                      <span className="text-gray-600">Espécies Registradas</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-blue-600">
                        {new Set(especiesAutorizadas.map(item => item.unidade).filter(Boolean)).size}
                      </span>
                      <span className="text-gray-600">Unidades Diferentes</span>
                    </div>
                  </div>
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
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`historico_${index}_ano`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
                              min="2000"
                              max="2030"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.especie}
                              onChange={(e) => atualizarHistoricoExploracao(item.id, 'especie', e.target.value)}
                              className={`w-full p-2 border rounded text-sm ${
                                errors[`historico_${index}_especie`] 
                                  ? 'border-red-500 bg-red-50' 
                                  : 'border-gray-200'
                              }`}
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

      case 6: // Licença Florestal
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Certificado de Emissão de Licença Florestal</h3>
              </div>
              <p className="text-gray-600">
                Complete as informações finais para emissão do certificado de licença florestal.
              </p>
            </div>

            {/* Exibir erros gerais */}
            {errors.areasFlorestaisGeral && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.areasFlorestaisGeral}
                  </p>
                </div>
              </div>
            )}

            {errors.especiesAutorizadasGeral && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.especiesAutorizadasGeral}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Finalidade da Licença */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Finalidade da Licença</h4>
                <p className="text-gray-600 mb-4">Selecione as finalidades da licença florestal:</p>
                <CustomInput
                  type="multiselect"
                  label="Finalidades da Licença"
                  value={formData.finalidadeLicenca}
                  options={[
                    { label: 'Exploração Comercial', value: 'EXPLORACAO_COMERCIAL' },
                    { label: 'Manejo Sustentável', value: 'MANEJO_SUSTENTAVEL' },
                    { label: 'Reflorestamento', value: 'REFLORESTAMENTO' },
                    { label: 'Pesquisa Científica', value: 'PESQUISA_CIENTIFICA' },
                    { label: 'Conservação', value: 'CONSERVACAO' }
                  ]}
                  onChange={(value) => handleInputChange('finalidadeLicenca', value)}
                />
              </div>

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
                    errorMessage={errors.validadeInicio}
                    iconStart={<Calendar size={18} />}
                  />
                  <CustomInput
                    type="date"
                    label="Válida até"
                    value={formData.validadeFim}
                    onChange={(value) => handleInputChange('validadeFim', value)}
                    required
                    errorMessage={errors.validadeFim}
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
                    errorMessage={errors.tecnicoResponsavel}
                    placeholder="Nome do técnico da DNF"
                    iconStart={<User size={18} />}
                  />

                  <CustomInput
                    type="text"
                    label="Cargo"
                    value={formData.cargoTecnico}
                    onChange={(value) => handleInputChange('cargoTecnico', value)}
                    required
                    errorMessage={errors.cargoTecnico}
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

              {/* Preview do Certificado */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Preview do Certificado Florestal</h4>
                  <button className="text-green-600 hover:text-green-800 flex items-center">
                    <Eye size={18} className="mr-2" />
                    Visualizar Completo
                  </button>
                </div>

                <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                  <div className="text-center mb-6 border-b-2 border-gray-400 pb-4">
                    <div className="text-xs font-bold mb-1">REPÚBLICA DE ANGOLA</div>
                    <div className="text-xs font-bold mb-1">MINISTÉRIO DA AGRICULTURA E FLORESTAS</div>
                    <div className="text-xs font-bold mb-1">DIRECÇÃO NACIONAL DE FLORESTAS (DNF)</div>
                    <div className="text-sm font-bold underline mb-2">CERTIFICADO DE EMISSÃO DE LICENÇA FLORESTAL</div>
                    
                  </div>

                  <div className="text-xs mb-4 text-justify">
                    Nos termos da legislação florestal em vigor, certifica-se que a licença acima identificada autoriza a 
                    empresa <strong>{getDisplayValue(formData.nomeEmpresa) || '________________________________________'}</strong>, 
                    Portadora da Licença de Exploração Nº<strong>{getDisplayValue(formData.numeroLicencaExploracao) || '__________________________'}</strong> 
                    exercer a actividade de Produtor florestal especificada, limitada às espécies, volumes e prazos indicados.
                  </div>

                  <div className="border border-gray-400 p-3 mb-4 bg-gray-100">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div><strong>Área Florestal (ID/Nome):</strong></div>
                      <div><strong>Localização (GPS/Prov.-Município-Comuna):</strong></div>
                      <div className="mt-2">
                        {areasFlorestais.length > 0 
                          ? areasFlorestais.map(area => area.nomeArea).join(', ')
                          : '_________________________'
                        }
                      </div>
                      <div className="mt-2">
                        {areasFlorestais.length > 0 
                          ? areasFlorestais.map(area => area.localizacao).join(', ')
                          : '_________________________'
                        }
                      </div>
                      <div className="mt-4"><strong>Espécies Autorizadas:</strong></div>
                      <div className="mt-4"><strong>Volume Autorizado (m³):</strong></div>
                      <div className="mt-2">
                        {especiesAutorizadas.length > 0 
                          ? especiesAutorizadas.map(esp => esp.especie).join(', ')
                          : '_________________________'
                        }
                      </div>
                      <div className="mt-2">
                        {especiesAutorizadas.length > 0 
                          ? especiesAutorizadas.reduce((acc, esp) => acc + (parseFloat(esp.volumeAutorizado) || 0), 0).toFixed(1)
                          : '_________________________'
                        }
                      </div>
                      <div className="mt-4"><strong>Validade: Início</strong></div>
                      <div className="mt-4"><strong>Validade: Fim</strong></div>
                      <div className="mt-2">
                        {formatDate(formData.validadeInicio) || '____/____/______'}
                      </div>
                      <div className="mt-2">
                        {formatDate(formData.validadeFim) || '____/____/______'}
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-400 p-2 mb-4">
                    <div className="text-xs font-bold mb-1">Condições Especiais / Observações</div>
                    <div className="text-xs">
                      {getDisplayValue(formData.condicoesEspeciais) || '_____________________________________________________'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div><strong>Local e Data de Emissão</strong></div>
                      <div>{getDisplayValue(formData.municipio) || '________________________'}</div>
                      <div>{formatDate(new Date())}</div>
                    </div>
                    <div>
                      <div><strong>Emitido por (DNF)</strong></div>
                      <div><strong>Nome:</strong> {getDisplayValue(formData.tecnicoResponsavel) || '__________________________'}</div>
                      <div><strong>Cargo:</strong> {getDisplayValue(formData.cargoTecnico) || '__________________________'}</div>
                      <div><strong>Assinatura:</strong> _____________________</div>
                    </div>
                  </div>

                  <div className="text-center mt-4 text-xs">
                    A licença é pessoal e intransmissível. O transporte de produtos florestais deve estar acompanhado deste 
                    certificado e do respectivo comprovativo de origem.
                  </div>
                </div>
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
      showToast('success', 'Sucesso', 'Certificado de Emissão de Licença Florestal gerado com sucesso!');

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
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Certificação de Produtor Florestal</h1>
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