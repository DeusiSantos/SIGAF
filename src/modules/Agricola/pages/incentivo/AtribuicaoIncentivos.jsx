import axios from 'axios';
import {
  AlertCircle,
  Award,
  Banknote,
  Building,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Filter,
  Gift,
  Loader,
  Mail,
  MapPin,
  Package,
  Phone,
  RotateCcw,
  Save,
  Search,
  Tractor,
  User,
  UserCheck,
  Users,
  X
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import CustomInput from '../../../../core/components/CustomInput';
import { useProdutoresAprovados } from '../../hooks/useRnpaData';


// Componente CustomInput mockado para o exemplo
{/*}const CustomInput = ({ type, label, value, onChange, options, placeholder, iconStart, required, disabled, rows, maxLength }) => {
  if (type === 'select') {
    return (
      <div className="space-y-1">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <select
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value?.value || ''}
          onChange={(e) => {
            const selected = options.find(opt => opt.value === e.target.value);
            onChange(selected);
          }}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options?.map((option, index) => (
            <option key={index} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="space-y-1">
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {iconStart && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {iconStart}
          </div>
        )}
        <input
          type={type}
          className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${iconStart ? 'pl-10' : ''}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
        />
      </div>
    </div>
  );
*/};

const AtribuicaoIncentivos = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [loadingIncentivos, setLoadingIncentivos] = useState(false);
  const [modalProdutor, setModalProdutor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagensCarregadas, setImagensCarregadas] = useState({});

  const { produtor: produtoresAprovados, loading: loadingProdutores } = useProdutoresAprovados();

  const [produtoresSelecionados, setProdutoresSelecionados] = useState([]);
  const [incentivoSelecionado, setIncentivoSelecionado] = useState(null);
  const [incentivosDisponiveis, setIncentivosDisponiveis] = useState([]);
  const [incentivosModal, setIncentivosModal] = useState([]);
  const [reembolsosModal, setReembolsosModal] = useState([]);
  const [loadingIncentivosModal, setLoadingIncentivosModal] = useState(false);
  const [loadingReembolsosModal, setLoadingReembolsosModal] = useState(false);

  const [filtrosProdutores, setFiltrosProdutores] = useState({
    provincia: '',
    municipio: '',
    nome: '',
    categoria: ''
  });

  // Dados da atribuição
  const [dadosAtribuicao, setDadosAtribuicao] = useState({
    dataDaAtribuicao: '',
    nomeDoResponsavel: '',
    observacoesGerais: '',
    prioridadeDeEntrega: 'NORMAL',
    localDeEntrega: 'PROPRIEDADE',
    dataDeVencimentoDoReembolso: ''
  });

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtoresPorPagina = 10;

  const steps = [
    { label: 'Seleção de Produtores', icon: Users },
    { label: 'Tipo de Incentivo', icon: Gift },
    { label: 'Resumo e Finalização', icon: Eye }
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Validações
      if (produtoresSelecionados.length === 0) {
        showToast('error', 'Validação', 'Selecione pelo menos um produtor para receber o incentivo');
        setLoading(false);
        return;
      }

      if (!incentivoSelecionado) {
        showToast('error', 'Validação', 'Selecione um tipo de incentivo');
        setLoading(false);
        return;
      }

      if (!dadosAtribuicao.nomeDoResponsavel) {
        showToast('error', 'Validação', 'Informe o responsável pela atribuição');
        setLoading(false);
        return;
      }

      // Preparar o payload no formato esperado pela API
      const payload = {
        nomeDoResponsavel: dadosAtribuicao.nomeDoResponsavel,
        prioridadeDeEntrega: dadosAtribuicao.prioridadeDeEntrega,
        localDeEntrega: dadosAtribuicao.localDeEntrega,
        dataDaAtribuicao: dadosAtribuicao.dataDaAtribuicao,
        observacoesGerais: dadosAtribuicao.observacoesGerais,
        produtorIds: produtoresSelecionados.map(_id => parseInt(_id)),
        incentivoId: incentivoSelecionado.id
      };

      console.log('Payload enviado:', payload);
      console.log('produtoresSelecionados:', produtoresSelecionados);

      // Requisição com Axios
      const response = await axios.post(
        'https://mwangobrainsa-001-site2.mtempurl.com/api/distribuicaoDeIncentivo',
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      // Sucesso
      showToast(
        'success',
        'Sucesso',
        `Incentivo "${incentivoSelecionado.nomeDoIncentivo}" atribuído com sucesso a ${produtoresSelecionados.length} produtores!`
      );

      // Resetar formulário
      setProdutoresSelecionados([]);
      setIncentivoSelecionado(null);
      setActiveIndex(0);
      setDadosAtribuicao({
        nomeDoResponsavel: '',
        observacoesGerais: '',
        prioridadeDeEntrega: 'NORMAL',
        localDeEntrega: 'PROPRIEDADE',
        dataDaAtribuicao: ''
      });

    } catch (error) {
      console.error('Erro ao processar atribuição:', error);
      const message = error.response?.data?.message || error.message || 'Erro ao processar atribuição';
      showToast('error', 'Erro', `Erro ao processar atribuição: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  // Função para carregar imagem do produtor
  const carregarImagemProdutor = async (produtorId) => {
    try {
      const imageUrl = `https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/${produtorId}/foto-beneficiary`;

      // Testar se a imagem carrega
      const img = new Image();
      img.onload = () => {
        setImagensCarregadas(prev => ({
          ...prev,
          [produtorId]: imageUrl
        }));
      };
      img.onerror = () => {
        setImagensCarregadas(prev => ({
          ...prev,
          [produtorId]: null
        }));
      };
      img.src = imageUrl;
    } catch (error) {
      console.error(`Erro ao carregar imagem para produtor ${produtorId}:`, error);
      setImagensCarregadas(prev => ({
        ...prev,
        [produtorId]: null
      }));
    }
  };

  const buscarIncentivos = async () => {
    setLoadingIncentivos(true);
    try {
      const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/incentivo/all');
      if (response.ok) {
        const data = await response.json();
        setIncentivosDisponiveis(data);
      } else {
        throw new Error('Erro ao buscar incentivos');
      }
    } catch (error) {
      console.error('Erro ao buscar incentivos:', error);
      showToast('error', 'Erro', 'Não foi possível carregar os incentivos disponíveis');
    } finally {
      setLoadingIncentivos(false);
    }
  };

  // Função para buscar incentivos do produtor para o modal
  const buscarIncentivosModalProdutor = useCallback(async (produtorId) => {
    try {
      setLoadingIncentivosModal(true);
      const response = await axios.get(`https://mwangobrainsa-001-site2.mtempurl.com/api/reembolsoDoIncentivo/produtor/${produtorId}/incentivos`);

      // Buscar detalhes de cada incentivo
      const incentivosComDetalhes = await Promise.all(
        response.data.map(async (incentivo) => {
          try {
            const detalhesResponse = await axios.get(`https://mwangobrainsa-001-site2.mtempurl.com/api/incentivo/produtor/${produtorId}/incentivos`);
            const detalheIncentivo = detalhesResponse.data.find(det => det.id === incentivo.incentivoId);

            return {
              id: incentivo.id,
              incentivoId: incentivo.incentivoId,
              nomeIncentivo: detalheIncentivo?.nomeDoIncentivo || 'Incentivo não encontrado',
              tipoIncentivo: detalheIncentivo?.tipoDoIncentivo || 'N/A',
              valorIncentivo: detalheIncentivo?.valorPorProduto || detalheIncentivo?.valorDoReembolso || 0,
              nomeResponsavel: incentivo.nomeDoResponsavel,
              prioridadeEntrega: incentivo.prioridadeDeEntrega,
              localEntrega: incentivo.localDeEntrega,
              dataAtribuicao: incentivo.dataDaAtribuicao,
              observacoes: incentivo.observacoesGerais,
              statusIncentivo: detalheIncentivo?.estadoDoReembolso || 'Activo'
            };
          } catch (error) {
            console.error(`Erro ao buscar detalhes do incentivo ${incentivo.incentivoId}:`, error);
            return {
              id: incentivo.id,
              incentivoId: incentivo.incentivoId,
              nomeIncentivo: 'Erro ao carregar detalhes',
              tipoIncentivo: 'N/A',
              valorIncentivo: 0,
              nomeResponsavel: incentivo.nomeDoResponsavel,
              prioridadeEntrega: incentivo.prioridadeDeEntrega,
              localEntrega: incentivo.localDeEntrega,
              dataAtribuicao: incentivo.dataDaAtribuicao,
              observacoes: incentivo.observacoesGerais,
              statusIncentivo: 'Erro'
            };
          }
        })
      );

      setIncentivosModal(incentivosComDetalhes);
    } catch (error) {
      console.error('Erro ao buscar incentivos do modal:', error);
      setIncentivosModal([]);
    } finally {
      setLoadingIncentivosModal(false);
    }
  }, []);

  // Função para buscar reembolsos do produtor (placeholder para futura API)
  const buscarReembolsosModalProdutor = useCallback(async () => {
    try {
      setLoadingReembolsosModal(true);

      // TODO: Substituir por API real quando disponível
      // const response = await axios.get(`https://mwangobrainsa-001-site4.mtempurl.com/api/reembolsoDoIncentivo/produtor/${produtorId}/reembolsos`);

      // Mock temporário até API estar disponível
      await new Promise(resolve => setTimeout(resolve, 1000));

      const reembolsosMock = [
        {
          id: 1,
          descricao: 'Reembolso sementes danificadas',
          valor: 12000,
          dataReembolso: '2024-12-15',
          status: 'Processado',
          referencia: 'RBL-INC-2024-001',
          percentual: 80,
          incentivoNome: 'Kit Sementes de Milho',
          responsavel: 'João Silva'
        },
        {
          id: 2,
          descricao: 'Reembolso parcial fertilizante',
          valor: 7200,
          dataReembolso: '2024-12-10',
          status: 'Aprovado',
          referencia: 'RBL-INC-2024-002',
          percentual: 90,
          incentivoNome: 'Fertilizante NPK',
          responsavel: 'Maria Santos'
        }
      ];

      setReembolsosModal(reembolsosMock);
    } catch (error) {
      console.error('Erro ao buscar reembolsos do modal:', error);
      setReembolsosModal([]);
    } finally {
      setLoadingReembolsosModal(false);
    }
  }, []);

  // Carregar incentivos da API na montagem do componente
  useEffect(() => {
    buscarIncentivos();
  }, []);

  // Carregar imagens dos produtores quando os dados chegarem
  useEffect(() => {
    if (produtoresAprovados?.length > 0) {
      produtoresAprovados.forEach(produtor => {
        if (produtor._id && !imagensCarregadas[produtor._id]) {
          carregarImagemProdutor(produtor._id);
        }
      });
    }
  }, [produtoresAprovados]);

  // Função para gerar dados fictícios consistentes baseados no ID
  { /* const gerarDadosFicticios = (produtorId) => {
    const seed = parseInt(produtorId?.toString().slice(-6) || '123456', 10);
    const random1 = (seed * 9301 + 49297) % 233280 / 233280;
    const random2 = (seed * 7919 + 32749) % 233280 / 233280;
    const random3 = (seed * 5471 + 19283) % 233280 / 233280;
    const random4 = (seed * 3137 + 47291) % 233280 / 233280;

    return {
      incentivosRecebidos: Math.floor(random1 * 5) + 1,
      ultimoReembolso: Math.floor(random2 * 50000 + 10000),
      totalReembolsos: Math.floor(random3 * 12) + 3,
      valorTotalReembolsos: Math.floor(random4 * 200000 + 50000),
      statusProdutor: random1 > 0.8 ? 'premium' : random1 > 0.6 ? 'activo' : 'novo',
      historicoIncentivos: [
        {
          id: 1,
          nome: 'Sementes de Milho',
          tipo: 'PRODUTO',
          quantidade: '50 kg',
          dataRecebimento: '2024-01-15',
          valor: 40000,
          status: 'Entregue'
        },
        {
          id: 2,
          nome: 'Subsídio Agrícola',
          tipo: 'DINHEIRO',
          quantidade: '1 unidade',
          dataRecebimento: '2023-12-10',
          valor: 75000,
          status: 'Pago'
        },
        {
          id: 3,
          nome: 'Kit Fertilizantes',
          tipo: 'PRODUTO',
          quantidade: '25 kg',
          dataRecebimento: '2023-11-20',
          valor: 35000,
          status: 'Entregue'
        }
      ],
      historicoReembolsos: [
        {
          id: 1,
          descricao: 'Reembolso produção milho Q4/2023',
          valor: 45000,
          dataReembolso: '2024-01-10',
          status: 'Pago',
          referencia: 'RBL-2024-001'
        },
        {
          id: 2,
          descricao: 'Reembolso transporte produtos',
          valor: 25000,
          dataReembolso: '2023-12-15',
          status: 'Pago',
          referencia: 'RBL-2023-089'
        },
        {
          id: 3,
          descricao: 'Reembolso sementes perdidas',
          valor: 18000,
          dataReembolso: '2023-11-30',
          status: 'Processando',
          referencia: 'RBL-2023-067'
        }
      ]
    };
  };  */}

  // Filtrar produtores
  const produtoresFiltrados = (produtoresAprovados || []).filter(produtor => {
    const nomeCompleto = [
      produtor.nome_produtor,
      produtor.nome_meio_produtor,
      produtor.sobrenome_produtor
    ].filter(Boolean).join(' ').toLowerCase();

    const filtroNome = filtrosProdutores.nome.toLowerCase();
    const filtroProvincia = filtrosProdutores.provincia;
    const filtroCategoria = filtrosProdutores.categoria;

    let passaNome = true;
    let passaProvincia = true;
    let passaCategoria = true;

    if (filtroNome) {
      passaNome = nomeCompleto.includes(filtroNome) ||
        produtor.beneficiary_id_number?.toLowerCase().includes(filtroNome);
    }

    if (filtroProvincia) {
      passaProvincia = produtor.provincia?.toLowerCase() === filtroProvincia.toLowerCase();
    }

    if (filtroCategoria) {
      const atividades = produtor.atividades_produtor?.toLowerCase() || '';
      if (filtroCategoria === 'agricultura') {
        passaCategoria = atividades.includes('agricultura');
      } else if (filtroCategoria === 'pecuaria') {
        passaCategoria = atividades.includes('pecuaria');
      }
    }

    return passaNome && passaProvincia && passaCategoria;
  });

  // Paginação
  const totalPaginas = Math.ceil(produtoresFiltrados.length / produtoresPorPagina);
  const produtoresPaginados = produtoresFiltrados.slice(
    (paginaAtual - 1) * produtoresPorPagina,
    paginaAtual * produtoresPorPagina
  );

  // Reset paginação quando filtros mudam
  useEffect(() => {
    setPaginaAtual(1);
  }, [filtrosProdutores]);

  // Selecionar/deselecionar produtor individual
  const toggleProdutorSelecionado = (produtorId) => {
    setProdutoresSelecionados(prev => {
      const novaSelecao = prev.includes(produtorId)
        ? prev.filter(id => id !== produtorId)
        : [...prev, produtorId];
      return novaSelecao;
    });
  };

  // Verificar se todos os produtores filtrados estão selecionados
  const todosSelecionados = produtoresFiltrados.length > 0 &&
    produtoresFiltrados.every(p => produtoresSelecionados.includes(p._id));

  // Selecionar todos os produtores filtrados
  const selecionarTodosProdutores = () => {
    if (todosSelecionados) {
      const produtoresFiltradosIds = produtoresFiltrados.map(p => p._id);
      setProdutoresSelecionados(prev =>
        prev.filter(id => !produtoresFiltradosIds.includes(id))
      );
    } else {
      const todosProdutoresIds = produtoresFiltrados.map(p => p._id);
      setProdutoresSelecionados(prev => {
        const novosIds = todosProdutoresIds.filter(id => !prev.includes(id));
        return [...prev, ...novosIds];
      });
    }
  };

  // Abrir modal com informações do produtor
  const abrirModalProdutor = async (produtor) => {
    setModalProdutor(produtor);
    setShowModal(true);

    // Buscar dados reais quando modal abrir
    await Promise.all([
      buscarIncentivosModalProdutor(produtor._id),
      buscarReembolsosModalProdutor(produtor._id)
    ]);
  };

  // Fechar modal
  const fecharModal = () => {
    setShowModal(false);
    setModalProdutor(null);
    // Limpar dados do modal
    setIncentivosModal([]);
    setReembolsosModal([]);
    setLoadingIncentivosModal(false);
    setLoadingReembolsosModal(false);
  };

  // Componente para Avatar do Produtor
  const AvatarProdutor = ({ produtor, tamanho = 'w-20 h-20' }) => {
    const nomeCompleto = [
      produtor.nome_produtor,
      produtor.nome_meio_produtor,
      produtor.sobrenome_produtor
    ].filter(Boolean).join(' ');

    const iniciais = nomeCompleto.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const corAvatar = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'][
      nomeCompleto.length % 5
    ];

    const imagemUrl = imagensCarregadas[produtor._id];

    if (imagemUrl) {
      return (
        <img
          src={imagemUrl}
          alt={nomeCompleto}
          className={`${tamanho} rounded-full object-cover shadow-lg border-2 border-white`}
          onError={() => {
            setImagensCarregadas(prev => ({
              ...prev,
              [produtor._id]: null
            }));
          }}
        />
      );
    }

    return (
      <div className={`${tamanho} rounded-full ${corAvatar} flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white`}>
        {iniciais}
      </div>
    );
  };

  // Modal de Informações do Produtor
  const ModalInformacoesProdutor = () => {
    if (!showModal || !modalProdutor) return null;

    const nomeCompleto = [
      modalProdutor.nome_produtor,
      modalProdutor.nome_meio_produtor,
      modalProdutor.sobrenome_produtor
    ].filter(Boolean).join(' ');

    // Calcular estatísticas baseadas nos dados reais
    const totalIncentivos = incentivosModal.length;
    const totalReembolsos = reembolsosModal.length;
    const valorTotalReembolsos = reembolsosModal.reduce((total, r) => total + r.valor, 0);
    const ultimoReembolso = reembolsosModal.length > 0 ?
      Math.max(...reembolsosModal.map(r => r.valor)) : 0;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header do Modal */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <AvatarProdutor produtor={modalProdutor} tamanho="w-16 h-16" />
                <div className='text-start'>
                  <h2 className="text-2xl font-bold">{nomeCompleto}</h2>
                  <p className="text-blue-100">BI: {modalProdutor.beneficiary_id_number}</p>
                  <p className="text-blue-100">{modalProdutor.provincia} - {modalProdutor.municipio}</p>
                </div>
              </div>
              <button
                onClick={fecharModal}
                className="p-2 hover:bg-blue-500 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Conteúdo do Modal */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {/* Estatísticas Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <span className="block text-2xl font-bold text-blue-600">{totalIncentivos}</span>
                <span className="text-sm text-gray-600">Incentivos Recebidos</span>
              </div>

              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Banknote className="w-6 h-6 text-green-600" />
                </div>
                <span className="block text-lg font-bold text-green-600">
                  {ultimoReembolso.toLocaleString('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                    minimumFractionDigits: 0
                  })}
                </span>
                <span className="text-sm text-gray-600">Último Reembolso</span>
              </div>

              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RotateCcw className="w-6 h-6 text-purple-600" />
                </div>
                <span className="block text-2xl font-bold text-purple-600">{totalReembolsos}</span>
                <span className="text-sm text-gray-600">Total Reembolsos</span>
              </div>

              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="w-6 h-6 text-orange-600" />
                </div>
                <span className="block text-lg font-bold text-orange-600">
                  {valorTotalReembolsos.toLocaleString('pt-AO', {
                    style: 'currency',
                    currency: 'AOA',
                    minimumFractionDigits: 0
                  })}
                </span>
                <span className="text-sm text-gray-600">Valor Total</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 gap-6">
              {/* Histórico de Incentivos */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-blue-600" />
                  Incentivos Recebidos
                  {loadingIncentivosModal && <Loader className="w-4 h-4 ml-2 animate-spin" />}
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {loadingIncentivosModal ? (
                    <div className="text-center py-8">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
                      <p className="text-sm text-gray-500">Carregando incentivos...</p>
                    </div>
                  ) : incentivosModal.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Nenhum incentivo encontrado</p>
                    </div>
                  ) : (
                    incentivosModal.map(incentivo => (
                      <div key={incentivo.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800 text-sm">{incentivo.nomeIncentivo}</h4>
                          <div className="flex space-x-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${incentivo.statusIncentivo === 'Activo' ? 'bg-green-100 text-green-700' :
                              incentivo.statusIncentivo === 'Erro' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                              {incentivo.statusIncentivo}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${incentivo.tipoIncentivo === 'DINHEIRO' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                              {incentivo.tipoIncentivo === 'DINHEIRO' ? 'Monetário' : 'Produto'}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 text-left">
                          <p className='flex justify-between'>
                            <span className="font-medium">Valor:</span>
                            <span>{incentivo.valorIncentivo.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Responsável:</span>
                            <span>{incentivo.nomeResponsavel}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Local:</span>
                            <span>{incentivo.localEntrega}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Data:</span>
                            <span>{new Date(incentivo.dataAtribuicao).toLocaleDateString('pt-BR')}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Prioridade:</span>
                            <span className={`font-medium ${incentivo.prioridadeEntrega === 'ALTA' ? 'text-red-600' :
                              incentivo.prioridadeEntrega === 'NORMAL' ? 'text-yellow-600' :
                                'text-green-600'
                              }`}>
                              {incentivo.prioridadeEntrega}
                            </span>
                          </p>
                          {incentivo.observacoes && (
                            <p className='mt-2'>
                              <span className="font-medium">Observações:</span>
                              <span className="block text-xs bg-gray-50 p-2 rounded mt-1">{incentivo.observacoes}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Histórico de Reembolsos */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Histórico de Reembolsos
                  {loadingReembolsosModal && <Loader className="w-4 h-4 ml-2 animate-spin" />}

                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {loadingReembolsosModal ? (
                    <div className="text-center py-8">
                      <Loader className="w-8 h-8 animate-spin mx-auto mb-2 text-green-600" />
                      <p className="text-sm text-gray-500">Carregando reembolsos...</p>
                    </div>
                  ) : reembolsosModal.length === 0 ? (
                    <div className="text-center py-8">
                      <CreditCard className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">Nenhum reembolso encontrado</p>
                    </div>
                  ) : (
                    reembolsosModal.map(reembolso => (
                      <div key={reembolso.id} className="bg-white p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800 text-sm">{reembolso.descricao}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${reembolso.status === 'Processado' ? 'bg-green-100 text-green-700' :
                            reembolso.status === 'Aprovado' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                            {reembolso.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 text-left">
                          <p className='flex justify-between'>
                            <span className="font-medium">Valor:</span>
                            <span>{reembolso.valor.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Percentual:</span>
                            <span>{reembolso.percentual}%</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Data:</span>
                            <span>{new Date(reembolso.dataReembolso).toLocaleDateString('pt-BR')}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Referência:</span>
                            <span>{reembolso.referencia}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Incentivo:</span>
                            <span className="text-xs">{reembolso.incentivoNome}</span>
                          </p>
                          <p className='flex justify-between'>
                            <span className="font-medium">Responsável:</span>
                            <span className="text-xs">{reembolso.responsavel}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer do Modal */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">

                <Clock className="inline-block mr-1" />
                Dados dos incentivos atualizados em tempo real
              </div>
              <button
                onClick={fecharModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Seleção de Produtores com Tabela
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Seleção de Produtores</h3>
              </div>
              <p className="text-gray-600">
                Selecione os produtores que receberão o incentivo. Use os filtros para encontrar produtores específicos.
              </p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filtros de Seleção
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <CustomInput
                  type="select"
                  label="Província"
                  value={filtrosProdutores.provincia ? { value: filtrosProdutores.provincia, label: filtrosProdutores.provincia } : null}
                  onChange={(option) => setFiltrosProdutores(prev => ({
                    ...prev,
                    provincia: option?.value || '',
                    municipio: ''
                  }))}
                  options={[
                    { value: '', label: 'Todas as Províncias' },
                    { value: 'LUANDA', label: 'Luanda' },
                    { value: 'BENGUELA', label: 'Benguela' },
                    { value: 'HUILA', label: 'Huíla' },
                    { value: 'CUANDO CUBANGO', label: 'Cuando Cubango' },
                    { value: 'NAMIBE', label: 'Namibe' },
                    { value: 'CABINDA', label: 'Cabinda' },
                    { value: 'ZAIRE', label: 'Zaire' },
                    { value: 'UIGE', label: 'Uíge' },
                    { value: 'MALANJE', label: 'Malanje' },
                    { value: 'LUNDA NORTE', label: 'Lunda Norte' },
                    { value: 'LUNDA SUL', label: 'Lunda Sul' },
                    { value: 'MOXICO', label: 'Moxico' },
                    { value: 'BIE', label: 'Bié' },
                    { value: 'HUAMBO', label: 'Huambo' },
                    { value: 'CUNENE', label: 'Cunene' },
                    { value: 'KWANZA NORTE', label: 'Kwanza Norte' },
                    { value: 'KWANZA SUL', label: 'Kwanza Sul' }
                  ]}
                  placeholder="Selecione uma província"
                />

                <CustomInput
                  type="select"
                  label="Actividade"
                  value={filtrosProdutores.categoria ? { value: filtrosProdutores.categoria, label: filtrosProdutores.categoria === 'agricultura' ? 'Agricultura' : 'Pecuária' } : null}
                  onChange={(option) => setFiltrosProdutores(prev => ({
                    ...prev,
                    categoria: option?.value || ''
                  }))}
                  options={[
                    { value: '', label: 'Todas as Actividades' },
                    { value: 'agricultura', label: 'Agricultura' },
                    { value: 'pecuaria', label: 'Pecuária' }
                  ]}
                  placeholder="Selecione uma actividade"
                />

                <CustomInput
                  type="text"
                  label="Nome ou BI"
                  value={filtrosProdutores.nome}
                  onChange={(value) => setFiltrosProdutores(prev => ({ ...prev, nome: value }))}
                  placeholder="Buscar por nome ou BI"
                  iconStart={<Search size={18} />}
                />

                <div className="flex items-end">
                  <button
                    onClick={selecionarTodosProdutores}
                    disabled={produtoresFiltrados.length === 0}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${produtoresFiltrados.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : todosSelecionados
                        ? 'bg-red-500 hover:bg-red-600 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                  >
                    <CheckCircle size={18} className="mr-2" />
                    {todosSelecionados ? 'Desmarcar Todos' : 'Selecionar Todos'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center bg-gray-50 rounded-lg px-4 py-2">
                  <div className="flex items-center text-blue-600 mr-4">
                    <UserCheck className="w-4 h-4 mr-1" />
                    <span className="font-bold">{produtoresSelecionados.length}</span>
                    <span className="text-gray-500 ml-1">selecionados</span>
                  </div>
                  <div className="text-gray-400">de</div>
                  <div className="flex items-center text-gray-600 ml-4">
                    <Search className="w-4 h-4 mr-1" />
                    <span className="font-bold">{produtoresFiltrados.length}</span>
                    <span className="text-gray-500 ml-1">encontrados</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabela de Produtores */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Lista de Produtores</h4>
                      <p className="text-sm text-gray-500">
                        {produtoresFiltrados.length === 0 ? 'Nenhum produtor encontrado' :
                          `${produtoresFiltrados.length} produtor${produtoresFiltrados.length === 1 ? '' : 'es'} encontrado${produtoresFiltrados.length === 1 ? '' : 's'}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {loadingProdutores ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader size={32} className="text-blue-600 animate-spin" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">Carregando produtores...</p>
                  <p className="text-gray-500">Aguarde enquanto buscamos os dados dos produtores aprovados</p>
                </div>
              ) : produtoresFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search size={32} className="text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">Nenhum produtor encontrado</p>
                  <p className="text-gray-500 mb-4">Ajuste os filtros para encontrar produtores específicos</p>
                </div>
              ) : (
                <>
                  {/* Tabela */}
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            <input
                              type="checkbox"
                              checked={todosSelecionados}
                              onChange={selecionarTodosProdutores}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Produtor
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Actividades
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Localização
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Contacto
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Informações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {produtoresPaginados.map((produtor) => {
                          const nomeCompleto = [
                            produtor.nome_produtor,
                            produtor.nome_meio_produtor,
                            produtor.sobrenome_produtor
                          ].filter(Boolean).join(' ');

                          const isSelecionado = produtoresSelecionados.includes(produtor._id);

                          return (
                            <tr
                              key={produtor._id}
                              className={`hover:bg-blue-50 transition-colors cursor-pointer ${isSelecionado ? 'bg-blue-50' : ''
                                }`}
                              onClick={() => toggleProdutorSelecionado(produtor._id)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <input
                                  type="checkbox"
                                  checked={isSelecionado}
                                  onChange={() => toggleProdutorSelecionado(produtor._id)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <AvatarProdutor produtor={produtor} />
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line">{nomeCompleto}</div>
                                    <div className="text-xs text-gray-500">BI: {produtor.beneficiary_id_number}</div>
                                    <div className="text-xs text-gray-500">Área: {produtor.area_total} ha</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex flex-wrap gap-1">
                                  {produtor.atividades_produtor?.split(' ').map((atividade, index) => {
                                    // Remover hífens e capitalizar a primeira letra
                                    const atividadeFormatada = atividade
                                      .replace(/_/g, ' ') // Remove todos os hífens
                                      .split(' ') // Divide em palavras caso tenha espaços
                                      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                      .join(' '); // Junta as palavras novamente

                                    return (
                                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {atividadeFormatada}
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-700">
                                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                  <div>
                                    <div>{produtor.municipio}</div>
                                    <div className="text-xs text-gray-500">{produtor.provincia}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-700">
                                  {produtor.beneficiary_phone_number && (
                                    <div className="flex items-center mb-1">
                                      <Phone className="w-3 h-3 mr-1 text-blue-500" />
                                      <span className="text-xs">{produtor.beneficiary_phone_number}</span>
                                    </div>
                                  )}
                                  {produtor.email && (
                                    <div className="flex items-center">
                                      <Mail className="w-3 h-3 mr-1 text-green-500" />
                                      <span className="text-xs">{produtor.email}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    abrirModalProdutor(produtor);
                                  }}
                                  className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                  title="Ver informações de incentivos e reembolsos"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Controles de Paginação */}
                  {totalPaginas > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                      <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <div className="text-sm text-gray-700">
                          A mostrar{' '}
                          <span className="font-medium">{((paginaAtual - 1) * produtoresPorPagina) + 1}</span>
                          {' '}a{' '}
                          <span className="font-medium">
                            {Math.min(paginaAtual * produtoresPorPagina, produtoresFiltrados.length)}
                          </span>
                          {' '}de{' '}
                          <span className="font-medium">{produtoresFiltrados.length}</span>
                          {' '}resultados
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))}
                            disabled={paginaAtual === 1}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                ${paginaAtual === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                              }
                            `}
                          >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Anterior
                          </button>

                          <button
                            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
                            disabled={paginaAtual === totalPaginas || totalPaginas === 0}
                            className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                ${paginaAtual === totalPaginas || totalPaginas === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                              }
                            `}
                          >
                            Próximo
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Resumo da Seleção */}
            {produtoresSelecionados.length > 0 && (
              <div className="mt-8 bg-gradient-to-r from-blue-50 via-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="text-xl font-bold text-gray-800">Resumo da Seleção</h5>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center bg-white rounded-xl p-4 shadow-sm border">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="block text-3xl font-bold text-blue-600 mb-1">
                      {produtoresSelecionados.length}
                    </span>
                    <span className="text-gray-600 font-medium">Produtores</span>
                  </div>

                  <div className="text-center bg-white rounded-xl p-4 shadow-sm border">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <span className="block text-3xl font-bold text-green-600 mb-1">
                      {new Set(produtoresFiltrados
                        .filter(p => produtoresSelecionados.includes(p._id))
                        .map(p => p.provincia)
                      ).size}
                    </span>
                    <span className="text-gray-600 font-medium">Províncias</span>
                  </div>

                  <div className="text-center bg-white rounded-xl p-4 shadow-sm border">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Building className="w-6 h-6 text-purple-600" />
                    </div>
                    <span className="block text-3xl font-bold text-purple-600 mb-1">
                      {new Set(produtoresFiltrados
                        .filter(p => produtoresSelecionados.includes(p._id))
                        .map(p => p.municipio)
                      ).size}
                    </span>
                    <span className="text-gray-600 font-medium">Municípios</span>
                  </div>

                  <div className="text-center bg-white rounded-xl p-4 shadow-sm border">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Tractor className="w-6 h-6 text-orange-600" />
                    </div>
                    <span className="block text-3xl font-bold text-orange-600 mb-1">
                      {new Set(produtoresFiltrados
                        .filter(p => produtoresSelecionados.includes(p._id))
                        .map(p => p.atividades_produtor)
                      ).size}
                    </span>
                    <span className="text-gray-600 font-medium">Actividades</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Tipo de Incentivo (mantido igual)
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Seleção do Tipo de Incentivo</h3>
              </div>
              <p className="text-gray-600">
                Escolha o tipo de incentivo que será atribuído aos produtores selecionados.
              </p>
            </div>

            {/* Incentivos Disponíveis */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Incentivos Disponíveis</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incentivosDisponiveis.map(incentivo => {
                  const isSelected = incentivoSelecionado?.id === incentivo.id;
                  const IconComponent = incentivo.tipoDoIncentivo === 'DINHEIRO' ? DollarSign : Package;

                  return (
                    <div
                      key={incentivo.id}
                      className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setIncentivoSelecionado(incentivo)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${incentivo.tipoDoIncentivo === 'DINHEIRO'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                          }`}>
                          <IconComponent size={24} />
                        </div>
                        {isSelected && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check size={16} className="text-white" />
                          </div>
                        )}
                      </div>

                      <h5 className="font-bold text-gray-900 mb-2">{incentivo.nomeDoIncentivo}</h5>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{incentivo.descricaoDoIncentivo}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tipo:</span>
                          <span className={`font-medium ${incentivo.tipoDoIncentivo === 'DINHEIRO' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                            {incentivo.tipoDoIncentivo === 'DINHEIRO' ? 'Monetário' : 'Produto'}
                          </span>
                        </div>

                        {incentivo.tipoDoIncentivo === 'DINHEIRO' ? (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Valor:</span>
                            <span className="font-bold text-green-600">
                              {incentivo.valorPorProduto?.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                            </span>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Produto:</span>
                              <span className="font-medium text-gray-700">{incentivo.nomeDoProduto}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Quantidade:</span>
                              <span className="font-medium text-gray-700">{incentivo.quantidadePorProduto} {incentivo.unidade}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Configurações de Entrega */}
            {incentivoSelecionado && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Configurações de Entrega</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="text"
                    label="Responsável pela Atribuição"
                    value={dadosAtribuicao.nomeDoResponsavel}
                    onChange={(value) => setDadosAtribuicao(prev => ({ ...prev, nomeDoResponsavel: value }))}
                    placeholder="Nome do responsável"
                    required
                    iconStart={<User size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Prioridade de Entrega"
                    value={{
                      value: dadosAtribuicao.prioridadeDeEntrega, label:
                        dadosAtribuicao.prioridadeDeEntrega === 'ALTA' ? 'Alta Prioridade' :
                          dadosAtribuicao.prioridadeDeEntrega === 'NORMAL' ? 'Prioridade Normal' : 'Baixa Prioridade'
                    }}
                    onChange={(option) => setDadosAtribuicao(prev => ({ ...prev, prioridadeDeEntrega: option.value }))}
                    options={[
                      { value: 'ALTA', label: 'Alta Prioridade' },
                      { value: 'NORMAL', label: 'Prioridade Normal' },
                      { value: 'BAIXA', label: 'Baixa Prioridade' }
                    ]}
                    placeholder="Selecione a prioridade"
                  />

                  <CustomInput
                    type="select"
                    label="Local de Entrega"
                    value={{
                      value: dadosAtribuicao.localDeEntrega, label:
                        dadosAtribuicao.localDeEntrega === 'PROPRIEDADE' ? 'Na Propriedade' : 'Posto de Entrega'
                    }}
                    onChange={(option) => setDadosAtribuicao(prev => ({ ...prev, localDeEntrega: option.value }))}
                    options={[
                      { value: 'PROPRIEDADE', label: 'Na Propriedade' },
                      { value: 'POSTO_ENTREGA', label: 'Posto de Entrega' }
                    ]}
                    placeholder="Selecione o local"
                    iconStart={<MapPin size={18} />}
                  />

                  <CustomInput
                    type="date"
                    label="Data da Atribuição"
                    value={dadosAtribuicao.dataDaAtribuicao}
                    onChange={(date) => setDadosAtribuicao(prev => ({ ...prev, dataDaAtribuicao: date }))}
                    required
                    placeholder="Selecione a data"
                  />
                </div>

                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Observações Gerais"
                    value={dadosAtribuicao.observacoesGerais}
                    onChange={(value) => setDadosAtribuicao(prev => ({ ...prev, observacoesGerais: value }))}
                    placeholder="Informações adicionais sobre a atribuição..."
                    rows={3}
                    maxLength={500}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Resumo e Finalização (mantido igual)
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Resumo da Atribuição</h3>
              </div>
              <p className="text-gray-600">
                Revise todos os dados da atribuição antes de finalizar. Verifique se todas as informações estão corretas.
              </p>
            </div>

            <div className="space-y-6">
              {/* Resumo dos Produtores */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-blue-600" />
                  Produtores Selecionados ({produtoresSelecionados.length})
                </h4>

                {produtoresSelecionados.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
                    {produtoresFiltrados
                      .filter(p => produtoresSelecionados.includes(p._id))
                      .map(produtor => {
                        const nomeCompleto = [
                          produtor.nome_produtor,
                          produtor.nome_meio_produtor,
                          produtor.sobrenome_produtor
                        ].filter(Boolean).join(' ');

                        return (
                          <div key={produtor._id} className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center">
                            <AvatarProdutor produtor={produtor} />
                            <div className="ml-3">
                              <h5 className="font-semibold text-blue-900 text-sm">{nomeCompleto}</h5>
                              <p className="text-xs text-blue-700">BI: {produtor.beneficiary_id_number}</p>
                              <p className="text-xs text-blue-600">{produtor.provincia} - {produtor.municipio}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Resumo do Incentivo */}
              {incentivoSelecionado && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Gift className="w-5 h-5 mr-2 text-blue-600" />
                    Incentivo Selecionado
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Incentivo</label>
                        <p className="text-lg font-semibold text-gray-900">{incentivoSelecionado.nomeDoIncentivo}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <p className={`text-lg font-semibold ${incentivoSelecionado.tipoDoIncentivo === 'DINHEIRO' ? 'text-green-600' : 'text-blue-600'
                          }`}>
                          {incentivoSelecionado.tipoDoIncentivo === 'DINHEIRO' ? 'Incentivo Monetário' : 'Produto/Insumo'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {incentivoSelecionado.tipoDoIncentivo === 'DINHEIRO' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Valor por Produtor</label>
                          <p className="text-xl font-bold text-green-600">
                            {incentivoSelecionado.valorPorProduto?.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Produto e Quantidade</label>
                          <p className="text-lg font-semibold text-blue-600">
                            {incentivoSelecionado.quantidadePorProduto} {incentivoSelecionado.unidade} - {incentivoSelecionado.nomeDoProduto}
                          </p>
                        </div>
                      )}
                    </div>
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
  const canProceed = () => {
    switch (activeIndex) {
      case 0: return produtoresSelecionados.length > 0;
      case 1: return incentivoSelecionado !== null && dadosAtribuicao.nomeDoResponsavel;
      case 2: return true;
      default: return true;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
          toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
            'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
          }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {toastMessage.severity === 'success' && <CheckCircle size={20} />}
              {toastMessage.severity === 'error' && <AlertCircle size={20} />}
            </div>
            <div>
              <p className="font-bold">{toastMessage.summary}</p>
              <p className="text-sm">{toastMessage.detail}</p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Informações do Produtor */}
      <ModalInformacoesProdutor />

      <div className="">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Atribuição de Incentivos</h1>
            <p className="text-gray-600">Sistema de gestão e distribuição de incentivos para produtores aprovados</p>
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
                    index === activeIndex ? 'bg-gradient-to-r from-blue-100 to-blue-50 text-slate-800 shadow-lg' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${index === activeIndex ? 'text-slate-700' : 'text-gray-500'
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
              className="bg-gradient-to-r from-blue-200 to-blue-50 h-2 transition-all duration-300 rounded-full"
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
              className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${!canProceed() ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' :
                isLastStep
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              disabled={loading || !canProceed()}
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
                  <Save size={20} className="mr-2" />
                  Confirmar Atribuição
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

export default AtribuicaoIncentivos;