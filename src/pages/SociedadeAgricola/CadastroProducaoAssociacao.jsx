import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Factory,
  Globe
} from 'lucide-react';

// Componente CustomInput simplificado
const CustomInput = ({
  type,
  label,
  value,
  onChange,
  options = [],
  required = false,
  errorMessage,
  placeholder,
  iconStart,
  disabled = false,
  helperText,
  confirmField = false,
  originalValue,
  maxLength,
  min,
  max,
  step,
  rows = 3
}) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const errorClasses = errorMessage ? "border-red-300 focus:ring-red-500" : "";
  const disabledClasses = disabled ? "bg-gray-50 cursor-not-allowed" : "bg-white";

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <div className="relative">
            {iconStart && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {iconStart}
              </div>
            )}
            <select
              className={`${baseClasses} ${errorClasses} ${disabledClasses} ${iconStart ? 'pl-11' : ''}`}
              value={typeof value === 'object' ? value?.value || '' : value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            >
              <option value="">{placeholder || 'Selecione...'}</option>
              {options.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      onChange([...currentValues, option.value]);
                    } else {
                      onChange(currentValues.filter(v => v !== option.value));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'textarea':
        return (
          <textarea
            className={`${baseClasses} ${errorClasses} ${disabledClasses} resize-none`}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
          />
        );

      case 'date':
        return (
          <div className="relative">
            {iconStart && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {iconStart}
              </div>
            )}
            <input
              type="date"
              className={`${baseClasses} ${errorClasses} ${disabledClasses} ${iconStart ? 'pl-11' : ''}`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              min={min}
              max={max}
            />
          </div>
        );

      case 'number':
        return (
          <div className="relative">
            {iconStart && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {iconStart}
              </div>
            )}
            <input
              type="number"
              className={`${baseClasses} ${errorClasses} ${disabledClasses} ${iconStart ? 'pl-11' : ''}`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
            />
          </div>
        );

      default:
        return (
          <div className="relative">
            {iconStart && (
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                {iconStart}
              </div>
            )}
            <input
              type={type}
              className={`${baseClasses} ${errorClasses} ${disabledClasses} ${iconStart ? 'pl-11' : ''} ${confirmField && value !== originalValue ? 'border-red-300' : ''}`}
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
            />
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {renderInput()}
      {errorMessage && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          {errorMessage}
        </p>
      )}
      {helperText && !errorMessage && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
      {confirmField && value && value !== originalValue && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle size={14} className="mr-1" />
          Os valores não coincidem
        </p>
      )}
    </div>
  );
};

// Dados simulados de produções existentes por cooperativa
const producoesExistentesPorCooperativa = {
  1: [
    {
      id: 1,
      ano: 2024,
      tipo: 'AGRICOLA',
      produto: 'MILHO',
      area: 50,
      producao: 200,
      dataRegistro: '2024-03-15'
    },
    {
      id: 2,
      ano: 2024,
      tipo: 'PECUARIA',
      produto: 'BOVINO',
      cabecas: 30,
      producao: '1500kg carne',
      dataRegistro: '2024-04-10'
    }
  ],
  2: [
    {
      id: 3,
      ano: 2024,
      tipo: 'AGRICOLA',
      produto: 'CAFE',
      area: 25,
      producao: 100,
      dataRegistro: '2024-02-20'
    }
  ]
};

// Dados simulados de cooperativas existentes
const cooperativasExistentes = [
  {
    id: 1,
    nome: "Associacao Agrícola Esperança",                 // ✅ ADICIONADO  
    tipo: 'ASSOCIACAO',                                    // ✅ ADICIONADO
    codigo: "CAE001",                                       // ✅ ADICIONADO
    nomeCooperativa: "Associações Agrícola Esperança",
    sigla: "CAE001",
    nif: "1234567890",
    dataFundacao: "2010-03-15",
    provincia: "LUANDA",
    municipio: "Luanda",
    comuna: "Ingombota",
    telefone: "222345678",
    email: "esperanca.agri@coop.ao",
    atividades: ["Agricultura", "Pecuária"],
    outrasAtividades: "Processamento de mandioca",
    numeroMembros: 45,
    areaTotal: 120,
    presidente: "João Manuel Silva",
    status: "ATIVO"

  },
  {
    id: 2,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa de Produtores de Café do Uíge",      // ✅ ADICIONADO
    codigo: "CPCU002",                                      // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa de Produtores de Café do Uíge",
    sigla: "CPCU002",
    nif: "2345678901",
    dataFundacao: "2008-07-22",
    provincia: "UÍGE",
    municipio: "Uíge",
    comuna: "Sede",
    telefone: "234567890",
    email: "cafe.uige@coop.ao",
    atividades: ["Agricultura"],
    outrasAtividades: "Torrefação e comercialização de café",
    numeroMembros: 78,
    areaTotal: 350,
    presidente: "Maria dos Santos",
    status: "ATIVO"
  },
  {
    id: 3,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa Agropecuária Unidos do Campo",       // ✅ ADICIONADO
    codigo: "CAUC003",                                      // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa Agropecuária Unidos do Campo",
    sigla: "CAUC003",
    nif: "3456789012",
    dataFundacao: "2012-11-08",
    provincia: "BENGUELA",
    municipio: "Benguela",
    comuna: "Lobito",
    telefone: "272567890",
    email: "unidos.campo@coop.ao",
    atividades: ["Agropecuária", "Aquicultura"],
    outrasAtividades: "Criação de suínos e aves",
    numeroMembros: 62,
    areaTotal: 280,
    presidente: "Carlos Alberto",
    status: "ATIVO"
  },
  {
    id: 4,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa de Apicultores do Planalto",         // ✅ ADICIONADO
    codigo: "CAP004",                                       // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa de Apicultores do Planalto",
    sigla: "CAP004",
    nif: "4567890123",
    dataFundacao: "2015-05-12",
    provincia: "HUAMBO",
    municipio: "Huambo",
    comuna: "Sede",
    telefone: "241678901",
    email: "mel.planalto@coop.ao",
    atividades: ["Produtos florestais"],
    outrasAtividades: "Produção de mel e cera de abelha",
    numeroMembros: 35,
    areaTotal: 150,
    presidente: "Ana Paula Ferreira",
    status: "ATIVO"
  },
  {
    id: 5,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa Hortícola da Huíla",                 // ✅ ADICIONADO
    codigo: "CHH005",                                       // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa Hortícola da Huíla",
    sigla: "CHH005",
    nif: "5678901234",
    dataFundacao: "2009-09-30",
    provincia: "HUILA",
    municipio: "Lubango",
    comuna: "Humpata",
    telefone: "261789012",
    email: "horticola.huila@coop.ao",
    atividades: ["Agricultura"],
    outrasAtividades: "Cultivo de hortaliças e legumes",
    numeroMembros: 55,
    areaTotal: 200,
    presidente: "Pedro Miguel",
    status: "INATIVO"
  },
  {
    id: 6,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa de Piscicultores do Kwanza",         // ✅ ADICIONADO
    codigo: "CPK006",                                       // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa de Piscicultores do Kwanza",
    sigla: "CPK006",
    nif: "6789012345",
    dataFundacao: "2018-01-20",
    provincia: "KWANZA SUL",
    municipio: "Sumbe",
    comuna: "Porto Amboim",
    telefone: "234890123",
    email: "peixe.kwanza@coop.ao",
    atividades: ["Aquicultura"],
    outrasAtividades: "Criação de tilápia e bagre",
    numeroMembros: 28,
    areaTotal: 80,
    presidente: "Luisa Santos",
    status: "ATIVO"
  },
  {
    id: 7,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa de Criadores de Gado do Cunene",     // ✅ ADICIONADO
    codigo: "CCGC007",                                      // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa de Criadores de Gado do Cunene",
    sigla: "CCGC007",
    nif: "7890123456",
    dataFundacao: "2013-04-15",
    provincia: "CUNENE",
    municipio: "Ondjiva",
    comuna: "Sede",
    telefone: "265890123",
    email: "gado.cunene@coop.ao",
    atividades: ["Pecuária"],
    outrasAtividades: "Criação de bovinos e caprinos",
    numeroMembros: 92,
    areaTotal: 450,
    presidente: "António Fernandes",
    status: "ATIVO"
  },
  {
    id: 8,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa de Produtores de Algodão do Malanje", // ✅ ADICIONADO
    codigo: "CPAM008",                                      // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa de Produtores de Algodão do Malanje",
    sigla: "CPAM008",
    nif: "8901234567",
    dataFundacao: "2011-09-12",
    provincia: "MALANJE",
    municipio: "Malanje",
    comuna: "Sede",
    telefone: "251901234",
    email: "algodao.malanje@coop.ao",
    atividades: ["Agricultura"],
    outrasAtividades: "Beneficiamento e comercialização de algodão",
    numeroMembros: 67,
    areaTotal: 320,
    presidente: "Esperança Malungo",
    status: "ATIVO"
  },
  {
    id: 9,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa Florestal da Lunda Norte",           // ✅ ADICIONADO
    codigo: "CFLN009",                                      // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa Florestal da Lunda Norte",
    sigla: "CFLN009",
    nif: "9012345678",
    dataFundacao: "2016-02-28",
    provincia: "LUNDA NORTE",
    municipio: "Dundo",
    comuna: "Sede",
    telefone: "252012345",
    email: "florestal.lunda@coop.ao",
    atividades: ["Produtos florestais"],
    outrasAtividades: "Exploração sustentável de madeira",
    numeroMembros: 38,
    areaTotal: 180,
    presidente: "Domingos Kassoma",
    status: "ATIVO"
  },
  {
    id: 10,
    tipo: 'COOPERATIVA',                                    // ✅ ADICIONADO
    nome: "Cooperativa de Mulheres Produtoras do Bié",      // ✅ ADICIONADO
    codigo: "CMPB010",                                      // ✅ ADICIONADO
    nomeCooperativa: "Cooperativa de Mulheres Produtoras do Bié",
    sigla: "CMPB010",
    nif: "0123456789",
    dataFundacao: "2014-06-08",
    provincia: "BIÉ",
    municipio: "Kuito",
    comuna: "Sede",
    telefone: "248123456",
    email: "mulheres.bie@coop.ao",
    atividades: ["Agricultura", "Pecuária"],
    outrasAtividades: "Cultivo de cereais e criação de aves",
    numeroMembros: 156,
    areaTotal: 95,
    presidente: "Maria Benedita Chaves",
    status: "ATIVO"
  }
];

const CadastroProducaoAssociacao = () => {
  const { cooperativaId } = useParams(); // Captura o ID da URL
  const navigate = useNavigate(); // Para navegação
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [cooperativaSelecionada, setCooperativaSelecionada] = useState(null);

  // Estados para as tabelas dinâmicas
  const [producaoAgricola, setProducaoAgricola] = useState([]);
  const [producaoPecuaria, setProducaoPecuaria] = useState([]);
  const [vistorias, setVistorias] = useState([]);
  const [producoesExistentes, setProducoesExistentes] = useState([]);

  // Estado inicial do formulário
  const initialState = {
    // Dados da Cooperativa
    tipoEntidade: '',
    nomeCooperativa: '',
    nif: '',
    codigoProdutor: '',

    // Dados da Exploração
    nomePropriedade: '',
    coordenadasGPS: '',
    latitude: '',
    longitude: '',
    altitude: '',
    precisao: '',
    areaTotalExplorada: '',
    atividadePrincipal: '',

    // Certificação
    finalidadeCertificado: [],
    validadeInicio: '',
    validadeFim: '',
    observacoesTecnicas: '',
    tecnicoResponsavel: '',
    numeroProcesso: '',
    municipioEmissao: '',
    dataEmissao: ''
  };

  const [formData, setFormData] = useState(initialState);

  // Carregar dados da cooperativa se ID for fornecido
  useEffect(() => {
    console.log('Cooperativa ID da URL:', cooperativaId);

    if (cooperativaId) {
      const cooperativa = cooperativasExistentes.find(c => c.id === parseInt(cooperativaId));
      console.log('Cooperativa encontrada:', cooperativa);

      if (cooperativa) {
        setCooperativaSelecionada(cooperativa);
        setFormData(prev => ({
          ...prev,
          tipoEntidade: cooperativa.tipo,
          nomeCooperativa: cooperativa.nome,
          nif: cooperativa.nif,
          codigoProdutor: cooperativa.codigo
        }));

        // Carregar produções existentes
        const producoes = producoesExistentesPorCooperativa[parseInt(cooperativaId)] || [];
        setProducoesExistentes(producoes);
        console.log('Produções existentes:', producoes);

        showToast('success', 'Cooperativa Carregada', 'Dados da cooperativa preenchidos automaticamente!');
      } else {
        showToast('error', 'Erro', 'Cooperativa não encontrada!');
      }
    }
  }, [cooperativaId]);

  const steps = [
    { label: 'Dados da Entidade', icon: Factory },
    { label: 'Exploração', icon: Tractor },
    { label: 'Produção Agrícola', icon: Wheat },
    { label: 'Produção Pecuária', icon: Beef },
    { label: 'Vistorias', icon: ClipboardCheck },
    { label: 'Certificação', icon: Award }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Funções para gerenciar tabelas dinâmicas
  const adicionarProducaoAgricola = () => {
    const novaProducao = {
      id: Date.now(),
      ano: new Date().getFullYear(),
      produto: '',
      especieVariedade: '',
      areaCultivada: '',
      producao: '',
      modoProducao: '',
      meiosDisponiveis: []
    };
    setProducaoAgricola([...producaoAgricola, novaProducao]);
  };

  const removerProducaoAgricola = (id) => {
    setProducaoAgricola(producaoAgricola.filter(item => item.id !== id));
  };

  const atualizarProducaoAgricola = (id, campo, valor) => {
    setProducaoAgricola(producaoAgricola.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const adicionarProducaoPecuaria = () => {
    const novaProducao = {
      id: Date.now(),
      ano: new Date().getFullYear(),
      especie: '',
      racaVariedade: '',
      numeroCabecas: '',
      producao: '',
      observacoes: ''
    };
    setProducaoPecuaria([...producaoPecuaria, novaProducao]);
  };

  const removerProducaoPecuaria = (id) => {
    setProducaoPecuaria(producaoPecuaria.filter(item => item.id !== id));
  };

  const atualizarProducaoPecuaria = (id, campo, valor) => {
    setProducaoPecuaria(producaoPecuaria.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const adicionarVistoria = () => {
    const novaVistoria = {
      id: Date.now(),
      dataVisita: '',
      tecnicoResponsavel: '',
      observacoesTecnicas: '',
      assinatura: ''
    };
    setVistorias([...vistorias, novaVistoria]);
  };

  const removerVistoria = (id) => {
    setVistorias(vistorias.filter(item => item.id !== id));
  };

  const atualizarVistoria = (id, campo, valor) => {
    setVistorias(vistorias.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Dados da Entidade
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Factory className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados da Associação</h3>
              </div>
              <p className="text-gray-600">
                Informações básicas da associação.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="select"
                  label="Tipo de Entidade"
                  value={formData.tipoEntidade}
                  options={[
                    { label: 'ASSOCIACAO', value: 'ASSOCIACAO' },
                  ]}
                  onChange={(value) => handleInputChange('tipoEntidade', value)}
                  required
                  disabled={cooperativaSelecionada !== null}
                  placeholder="Selecione o tipo"
                  iconStart={<Factory size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Nome da Associação"
                  value={formData.nomeCooperativa}
                  onChange={(value) => handleInputChange('nomeCooperativa', value)}
                  required
                  disabled={cooperativaSelecionada !== null}
                  placeholder="Nome completo da entidade"
                  iconStart={<Building size={18} />}
                />

                <CustomInput
                  type="text"
                  label="NIF"
                  value={formData.nif}
                  onChange={(value) => handleInputChange('nif', value)}
                  required
                  disabled={cooperativaSelecionada !== null}
                  placeholder="Número de Identificação Fiscal"
                  iconStart={<CreditCard size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Código da Associação"
                  value={formData.codigoProdutor}
                  onChange={(value) => handleInputChange('codigoProdutor', value)}
                  required
                  disabled={cooperativaSelecionada !== null}
                  placeholder="Código único da entidade"
                  iconStart={<CreditCard size={18} />}
                />
              </div>

              {cooperativaSelecionada && (
                <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <h5 className="font-semibold text-blue-800">Cooperativa Selecionada</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Nome:</strong> {cooperativaSelecionada.nome}</div>
                    <div><strong>NIF:</strong> {cooperativaSelecionada.nif}</div>
                    <div><strong>Código:</strong> {cooperativaSelecionada.codigo}</div>
                    <div><strong>Tipo:</strong> {cooperativaSelecionada.tipo === 'COOPERATIVA' ? 'Cooperativa' : 'Cooperativa'}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Dados da Exploração
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tractor className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados da Exploração Agrícola/Pecuária</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a área de exploração da cooperativa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="text"
                  label="Nome da Propriedade (se aplicável)"
                  value={formData.nomePropriedade}
                  onChange={(value) => handleInputChange('nomePropriedade', value)}
                  placeholder="Nome da fazenda/propriedade"
                  iconStart={<Home size={18} />}
                  helperText="Campo opcional"
                />

                <CustomInput
                  type="number"
                  label="Área Total Explorada (hectares)"
                  value={formData.areaTotalExplorada}
                  onChange={(value) => handleInputChange('areaTotalExplorada', value)}
                  required
                  placeholder="0.0"
                  step="0.1"
                  min="0"
                  iconStart={<Tractor size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Atividade Principal"
                  value={formData.atividadePrincipal}
                  options={[
                    { label: 'Agricultura', value: 'AGRICULTURA' },
                    { label: 'Pecuária', value: 'PECUARIA' },
                    { label: 'Mista (Agricultura + Pecuária)', value: 'MISTA' }
                  ]}
                  onChange={(value) => handleInputChange('atividadePrincipal', value)}
                  required
                  placeholder="Selecione a atividade principal"
                  iconStart={<Wheat size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Coordenadas GPS"
                  value={formData.coordenadasGPS}
                  onChange={(value) => handleInputChange('coordenadasGPS', value)}
                  placeholder="Ex: -8.838333, 13.234444"
                  iconStart={<MapPin size={18} />}
                  helperText="Formato: latitude, longitude"
                />

                <CustomInput
                  type="number"
                  label="Latitude"
                  value={formData.latitude}
                  onChange={(value) => handleInputChange('latitude', value)}
                  placeholder="-8.838333"
                  step="0.000001"
                  iconStart={<Globe size={18} />}
                />

                <CustomInput
                  type="number"
                  label="Longitude"
                  value={formData.longitude}
                  onChange={(value) => handleInputChange('longitude', value)}
                  placeholder="13.234444"
                  step="0.000001"
                  iconStart={<Globe size={18} />}
                />

                <CustomInput
                  type="number"
                  label="Altitude (metros)"
                  value={formData.altitude}
                  onChange={(value) => handleInputChange('altitude', value)}
                  placeholder="0"
                  min="0"
                  iconStart={<MapPin size={18} />}
                />

                <CustomInput
                  type="number"
                  label="Precisão (metros)"
                  value={formData.precisao}
                  onChange={(value) => handleInputChange('precisao', value)}
                  placeholder="0"
                  min="0"
                  iconStart={<MapPin size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Produção Agrícola
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wheat className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Detalhamento da Produção Agrícola</h3>
              </div>
              <p className="text-gray-600">
                Registre o histórico de produção agrícola da cooperativa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Produção Agrícola</h4>
                <button
                  onClick={adicionarProducaoAgricola}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Produção
                </button>
              </div>

              {producaoAgricola.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Ano</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Produto Agrícola</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Espécie/Variedade</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Área Cultivada (ha)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Produção (ton)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Modo de Produção</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Meios Disponíveis</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {producaoAgricola.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.ano}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'ano', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              min="2000"
                              max="2030"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.produto}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'produto', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="MILHO">Milho</option>
                              <option value="MANDIOCA">Mandioca</option>
                              <option value="FEIJAO">Feijão</option>
                              <option value="ARROZ">Arroz</option>
                              <option value="BATATA_DOCE">Batata-doce</option>
                              <option value="BANANA">Banana</option>
                              <option value="CAFE">Café</option>
                              <option value="TOMATE">Tomate</option>
                              <option value="CEBOLA">Cebola</option>
                              <option value="OUTROS">Outros</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.especieVariedade}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'especieVariedade', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Variedade..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.areaCultivada}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'areaCultivada', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.producao}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'producao', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.modoProducao}
                              onChange={(e) => atualizarProducaoAgricola(item.id, 'modoProducao', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="TRADICIONAL">Tradicional</option>
                              <option value="SEMI_INTENSIVO">Semi-intensivo</option>
                              <option value="INTENSIVO">Intensivo</option>
                              <option value="AGROECOLOGICO">Agroecológico</option>
                              <option value="ORGANICO">Orgânico</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <div className="space-y-1 text-xs">
                              {['Enxada', 'Tractor', 'Irrigação', 'Sementes melhoradas', 'Fertilizantes', 'Estufas'].map((meio) => (
                                <label key={meio} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={Array.isArray(item.meiosDisponiveis) ? item.meiosDisponiveis.includes(meio) : false}
                                    onChange={(e) => {
                                      const meios = Array.isArray(item.meiosDisponiveis) ? item.meiosDisponiveis : [];
                                      if (e.target.checked) {
                                        atualizarProducaoAgricola(item.id, 'meiosDisponiveis', [...meios, meio]);
                                      } else {
                                        atualizarProducaoAgricola(item.id, 'meiosDisponiveis', meios.filter(m => m !== meio));
                                      }
                                    }}
                                    className="w-3 h-3 mr-1"
                                  />
                                  {meio}
                                </label>
                              ))}
                            </div>
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerProducaoAgricola(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover linha"
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
                  <Wheat size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma produção agrícola registrada</p>
                  <p className="text-sm">Clique em "Adicionar Produção" para começar</p>
                </div>
              )}

              {producaoAgricola.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-800 mb-2">Resumo da Produção Agrícola</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-blue-600">
                        {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.areaCultivada) || 0), 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">Total Área (ha)</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-blue-600">
                        {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.producao) || 0), 0).toFixed(1)}
                      </span>
                      <span className="text-gray-600">Total Produção (ton)</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-purple-600">
                        {producaoAgricola.length}
                      </span>
                      <span className="text-gray-600">Registros</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Produção Pecuária
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Beef className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Detalhamento da Produção Pecuária</h3>
              </div>
              <p className="text-gray-600">
                Registre o histórico de produção pecuária da cooperativa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Produção Pecuária</h4>
                <button
                  onClick={adicionarProducaoPecuaria}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Produção
                </button>
              </div>

              {producaoPecuaria.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Ano</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Espécie Pecuária</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Raça/Variedade</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Nº de Cabeças/Litros</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Produção (carne/leite/ovos)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {producaoPecuaria.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.ano}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'ano', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              min="2000"
                              max="2030"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.especie}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'especie', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="BOVINO">Bovino</option>
                              <option value="SUINO">Suíno</option>
                              <option value="CAPRINO">Caprino</option>
                              <option value="OVINO">Ovino</option>
                              <option value="AVES">Aves</option>
                              <option value="PEIXES">Peixes</option>
                              <option value="COELHOS">Coelhos</option>
                              <option value="OUTROS">Outros</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.racaVariedade}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'racaVariedade', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Raça/Variedade..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.numeroCabecas}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'numeroCabecas', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              min="0"
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.producao}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'producao', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Ex: 500kg carne, 200L leite..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarProducaoPecuaria(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="2"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerProducaoPecuaria(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover linha"
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
                  <Beef size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma produção pecuária registrada</p>
                  <p className="text-sm">Clique em "Adicionar Produção" para começar</p>
                </div>
              )}

              {producaoPecuaria.length > 0 && (
                <div className="mt-6 p-4 bg-orange-50 rounded-lg">
                  <h5 className="font-semibold text-orange-800 mb-2">Resumo da Produção Pecuária</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-orange-600">
                        {producaoPecuaria.reduce((acc, item) => acc + (parseInt(item.numeroCabecas) || 0), 0)}
                      </span>
                      <span className="text-gray-600">Total Cabeças</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-red-600">
                        {new Set(producaoPecuaria.map(item => item.especie).filter(Boolean)).size}
                      </span>
                      <span className="text-gray-600">Espécies Diferentes</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-purple-600">
                        {producaoPecuaria.length}
                      </span>
                      <span className="text-gray-600">Registros</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Vistorias
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ClipboardCheck className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Vistorías e Acompanhamento Técnico</h3>
              </div>
              <p className="text-gray-600">
                Registre as vistorias técnicas realizadas na associação.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Vistorias</h4>
                <button
                  onClick={adicionarVistoria}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Vistoria
                </button>
              </div>

              {vistorias.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Data da Visita</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Técnico Responsável</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações Técnicas</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Assinatura</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vistorias.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="date"
                              value={item.dataVisita}
                              onChange={(e) => atualizarVistoria(item.id, 'dataVisita', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.tecnicoResponsavel}
                              onChange={(e) => atualizarVistoria(item.id, 'tecnicoResponsavel', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Nome do técnico..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoesTecnicas}
                              onChange={(e) => atualizarVistoria(item.id, 'observacoesTecnicas', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="3"
                              placeholder="Observações técnicas..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.assinatura}
                              onChange={(e) => atualizarVistoria(item.id, 'assinatura', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Assinatura do técnico..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerVistoria(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover vistoria"
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
                  <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma vistoria registrada</p>
                  <p className="text-sm">Clique em "Adicionar Vistoria" para começar</p>
                </div>
              )}
            </div>
          </div>
        );

      case 5: // Certificação
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Certificado de Produtor Agrícola e Pecuário</h3>
              </div>
              <p className="text-gray-600">
                Complete as informações finais para emissão do certificado da cooperativa.
              </p>
            </div>

            <div className="space-y-6">
              {/* Finalidade do Certificado */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Finalidade do Certificado</h4>
                <p className="text-gray-600 mb-4">Selecione para que fim o certificado será utilizado:</p>
                <CustomInput
                  type="multiselect"
                  value={formData.finalidadeCertificado}
                  options={[
                    { label: 'Reconhecimento como Produtor Formal', value: 'PRODUTOR_FORMAL' },
                    { label: 'Obtenção de Crédito Agrícola', value: 'CREDITO_AGRICOLA' },
                    { label: 'Contratação de Seguro Agrícola', value: 'SEGURO_AGRICOLA' },
                    { label: 'Participação em Programas Governamentais', value: 'PROGRAMAS_GOVERNAMENTAIS' }
                  ]}
                  onChange={(value) => handleInputChange('finalidadeCertificado', value)}
                />
              </div>

              {/* Informações do Certificado */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Informações do Certificado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="date"
                    label="Validade do Certificado (Início)"
                    value={formData.validadeInicio}
                    onChange={(value) => handleInputChange('validadeInicio', value)}
                    required
                    iconStart={<Calendar size={18} />}
                  />
                  <CustomInput
                    type="date"
                    label="Validade do Certificado (Fim)"
                    value={formData.validadeFim}
                    onChange={(value) => handleInputChange('validadeFim', value)}
                    required
                    iconStart={<Calendar size={18} />}
                  />
                  <CustomInput
                    type="date"
                    label="Data de Emissão"
                    value={formData.dataEmissao}
                    onChange={(value) => handleInputChange('dataEmissao', value)}
                    required
                    iconStart={<Calendar size={18} />}
                  />
                  <CustomInput
                    type="text"
                    label="Município de Emissão"
                    value={formData.municipioEmissao}
                    onChange={(value) => handleInputChange('municipioEmissao', value)}
                    required
                    placeholder="Município onde será emitido"
                    iconStart={<Building size={18} />}
                  />
                  <CustomInput
                    type="text"
                    label="Técnico Responsável"
                    value={formData.tecnicoResponsavel}
                    onChange={(value) => handleInputChange('tecnicoResponsavel', value)}
                    required
                    placeholder="Nome do técnico responsável"
                    iconStart={<User size={18} />}
                  />
                  <CustomInput
                    type="text"
                    label="Número do Processo"
                    value={formData.numeroProcesso}
                    onChange={(value) => handleInputChange('numeroProcesso', value)}
                    required
                    placeholder="Ex: CERT-COOP-2025-001"
                    iconStart={<FileText size={18} />}
                  />
                </div>
                <div className="mt-4">
                  <CustomInput
                    type="textarea"
                    label="Observações Técnicas"
                    value={formData.observacoesTecnicas}
                    onChange={(value) => handleInputChange('observacoesTecnicas', value)}
                    placeholder="Observações sobre a atividade produtiva da cooperativa..."
                    rows={4}
                  />
                </div>
              </div>

              {/* Preview do Certificado */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Preview do Certificado</h4>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center">
                    <Eye size={18} className="mr-2" />
                    Visualizar Completo
                  </button>
                </div>

                <div className="border-2 border-gray-300 rounded-lg p-6 bg-gray-50">
                  <div className="text-center mb-6">
                    <h5 className="text-xl font-bold text-gray-800 mb-2">CERTIFICADO DE PRODUTOR AGRÍCOLA E PECUÁRIO</h5>
                    <p className="text-sm text-gray-600">República de Angola - Ministério da Agricultura e Florestas</p>
                    <p className="text-sm text-gray-600">RNPA - Registo Nacional de Pequenos Agricultores</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <p><strong>CERTIFICA-SE QUE:</strong></p>
                    <p>A {formData.tipoEntidade === 'COOPERATIVA' ? 'Cooperativa' : 'Cooperativa'} <strong>{formData.nomeCooperativa || '[Nome da Entidade]'}</strong>,
                      com NIF nº <strong>{formData.nif || '[NIF]'}</strong> e código <strong>{formData.codigoProdutor || '[Código]'}</strong>,
                      encontra-se regularmente cadastrada junto das autoridades agrícolas e demonstra atividade produtiva
                      contínua e verificável.</p>

                    {formData.finalidadeCertificado && Array.isArray(formData.finalidadeCertificado) && formData.finalidadeCertificado.length > 0 && (
                      <div className="mt-3">
                        <p><strong>Este certificado é emitido para efeitos de:</strong></p>
                        <ul className="list-disc list-inside ml-4">
                          {formData.finalidadeCertificado.map((finalidade, index) => (
                            <li key={index}>{
                              finalidade === 'CREDITO_AGRICOLA' ? 'Obtenção de Crédito Agrícola' :
                                finalidade === 'SEGURO_AGRICOLA' ? 'Contratação de Seguro Agrícola' :
                                  finalidade === 'PRODUTOR_FORMAL' ? 'Reconhecimento como Produtor Formal' :
                                    finalidade === 'PROGRAMAS_GOVERNAMENTAIS' ? 'Participação em Programas Governamentais' :
                                      finalidade
                            }</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p><strong>Atividade Principal:</strong> {formData.atividadePrincipal || '[Não especificada]'}</p>
                        <p><strong>Área Total:</strong> {formData.areaTotalExplorada || '0'} ha</p>
                        <p><strong>Coordenadas:</strong> {formData.coordenadasGPS || '[Não informadas]'}</p>
                      </div>
                      <div>
                        <p><strong>Validade:</strong> {formData.validadeInicio || '[Data início]'} a {formData.validadeFim || '[Data fim]'}</p>
                        <p><strong>Emitido em:</strong> {formData.dataEmissao || '[Data emissão]'}</p>
                        <p><strong>Município:</strong> {formData.municipioEmissao || '[Município]'}</p>
                        <p><strong>Processo nº:</strong> {formData.numeroProcesso || '[Número do processo]'}</p>
                        <p><strong>Técnico:</strong> {formData.tecnicoResponsavel || '[Nome do técnico]'}</p>
                      </div>
                    </div>

                    {/* Resumo das Produções */}
                    {(producaoAgricola.length > 0 || producaoPecuaria.length > 0) && (
                      <div className="mt-4 p-3 bg-blue-50 rounded">
                        <p><strong>Resumo Produtivo:</strong></p>
                        {producaoAgricola.length > 0 && (
                          <p>• Produção Agrícola: {producaoAgricola.length} registros, {producaoAgricola.reduce((acc, item) => acc + (parseFloat(item.areaCultivada) || 0), 0).toFixed(1)} ha cultivados</p>
                        )}
                        {producaoPecuaria.length > 0 && (
                          <p>• Produção Pecuária: {producaoPecuaria.length} registros, {producaoPecuaria.reduce((acc, item) => acc + (parseInt(item.numeroCabecas) || 0), 0)} cabeças totais</p>
                        )}
                        {vistorias.length > 0 && (
                          <p>• Vistorias Técnicas: {vistorias.length} registros de acompanhamento</p>
                        )}
                      </div>
                    )}
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
      console.log("📄 Dados do Cadastro de Produção:", {
        cooperativaId: cooperativaId,
        dadosCooperativa: formData,
        producaoAgricola,
        producaoPecuaria,
        vistorias,
        producoesExistentesAnteriores: producoesExistentes
      });

      setTimeout(() => {
        setLoading(false);
        showToast('success', 'Sucesso', 'Cadastro de produção registrado com sucesso!');
      }, 2000);

    } catch (error) {
      setLoading(false);
      console.error('Erro ao registrar produção:', error);
      showToast('error', 'Erro', 'Erro ao registrar produção. Tente novamente.');
    }
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
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
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/GerenciaRNPA/cooperativas')}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} className="mr-2" />
                Voltar à Lista
              </button>

              {cooperativaSelecionada && (
                <div className="text-right text-sm text-gray-600">
                  <p>ID: {cooperativaId}</p>
                  <p>Código: {cooperativaSelecionada.codigo}</p>
                </div>
              )}
            </div>

            <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Produção</h1>
            <p className="text-xl text-gray-700 mb-2">Certificação da Associação</p>
            <p className="text-sm text-gray-600">República de Angola • RNPA - Registo Nacional de Pequenos Agricultores</p>
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
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                if (!isLastStep) {
                  setTimeout(() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }, 100);
                  setActiveIndex(prev => prev + 1);
                } else {
                  handleSubmit(e);
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
                  <Award size={20} className="mr-2" />
                  Gerar Certificado
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

        {/* Histórico de Produções Existentes */}
        {producoesExistentes.length > 0 && (
          <div className="mt-8 bg-white p-8 shadow-sm rounded-2xl border border-gray-200">
            <div className="flex items-center text-blue-700 mb-6">
              <FileText size={20} className="mr-3" />
              <h3 className="text-xl font-semibold">Histórico de Produções da Cooperativa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {producoesExistentes.map((producao) => (
                <div key={producao.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${producao.tipo === 'AGRICOLA'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                      }`}>
                      {producao.tipo === 'AGRICOLA' ? 'Agrícola' : 'Pecuária'}
                    </span>
                    <span className="text-xs text-gray-500">{producao.ano}</span>
                  </div>

                  <h4 className="font-semibold text-gray-800 mb-2">{producao.produto}</h4>

                  {producao.tipo === 'AGRICOLA' ? (
                    <div className="text-sm text-gray-600">
                      <p>Área: {producao.area} ha</p>
                      <p>Produção: {producao.producao} ton</p>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600">
                      <p>Cabeças: {producao.cabecas}</p>
                      <p>Produção: {producao.producao}</p>
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      Registrado em: {new Date(producao.dataRegistro).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Total de {producoesExistentes.length} registros</strong> de produção encontrados para esta cooperativa.
                Use este formulário para adicionar novos registros de produção.
              </p>
            </div>
          </div>
        )}

        {/* Information Card */}
        <div className="mt-8 bg-white p-8 shadow-sm rounded-2xl border border-gray-200">
          <div className="flex items-center text-blue-700 mb-4">
            <Award size={20} className="mr-3" />
            <h3 className="text-xl font-semibold">Sobre a Certificação da Associação</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Objetivo da Certificação:</h4>
              <p className="leading-relaxed">
                O Certificado reconhece formalmente a atividade produtiva de cooperativas e associações,
                facilitando o acesso a programas de apoio, crédito agrícola e seguros.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Requisitos:</h4>
              <ul className="space-y-2 leading-relaxed">
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Atividade produtiva contínua demonstrável
                </li>
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Registos de produção agrícola/pecuária
                </li>
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Acompanhamento técnico documentado
                </li>
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Documentação legal atualizada
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroProducaoAssociacao;