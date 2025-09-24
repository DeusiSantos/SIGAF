import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  User,
  Users,
  DollarSign,
  RotateCcw,
  Check,
  ChevronRight,
  ChevronLeft,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
  Search,
  Filter,
  Eye,
  Package,
  Wheat,
  Calendar,
  FileText,
  ArrowLeft,
  Calculator,
  Percent,
  Save,
  Phone,
  Mail,
  History,
  Award,
  CreditCard,
  Activity,
  TrendingUp,
  Banknote,
  X,
  Clock
} from 'lucide-react';
import axios from 'axios';
import CustomInput from '../../components/CustomInput';
import provinciasData from '../../components/Provincias.json'




const ReembolsoIncentivos = () => {
  const [errosReembolso, setErrosReembolso] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingProdutores, setLoadingProdutores] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [modalProdutor, setModalProdutor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [incentivosModal, setIncentivosModal] = useState([]);
  const [reembolsosModal, setReembolsosModal] = useState([]);
  const [loadingIncentivosModal, setLoadingIncentivosModal] = useState(false);
  const [loadingReembolsosModal, setLoadingReembolsosModal] = useState(false);

  // Estados para dados da API
  const [produtores, setProdutores] = useState([]);
  const [produtoresComIncentivos, setProdutoresComIncentivos] = useState([]);

  // Estados específicos
  const [produtorSelecionado, setProdutorSelecionado] = useState(null);
  const [incentivoSelecionado, setIncentivoSelecionado] = useState(null);
  const [filtrosProdutores, setFiltrosProdutores] = useState({
    provincia: '',
    municipio: '',
    nome: '',
    categoria: ''
  });
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [fotosProdutores, setFotosProdutores] = useState({});
  const [fotosCarregadas, setFotosCarregadas] = useState(new Set());

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const produtoresPorPagina = 10;

  // Dados do reembolso
  const [dadosReembolso, setDadosReembolso] = useState({
    dataReembolso: new Date().toISOString().split('T')[0],
    responsavel: '',
    motivoReembolso: '',
    percentualPersonalizado: '',
    observacoesGerais: '',
    prioridadeProcessamento: 'NORMAL',
    formaReembolso: 'TRANSFERENCIA'
  });

  const steps = [
    { label: 'Seleção do Produtor', icon: User },
    { label: 'Incentivo para Reembolso', icon: RotateCcw },
    { label: 'Resumo e Processamento', icon: Eye }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };



  // Função para buscar produtores com incentivos
  const buscarProdutoresComIncentivos = useCallback(async () => {
    try {
      setLoadingProdutores(true);

      // Buscar produtores com incentivos
      const response = await axios.get('https://mwangobrainsa-001-site2.mtempurl.com/api/reembolsoDoIncentivo/produtoresComIncentivo');
      const produtoresData = response.data;

      // Para cada produtor, buscar o número de incentivos
      const produtoresComCount = await Promise.all(
        produtoresData.map(async (produtor) => {
          try {
            const incentivosResponse = await axios.get(
              `https://mwangobrainsa-001-site2.mtempurl.com/api/reembolsoDoIncentivo/totalIncentivoPorProdutor/${produtor._id}`
            );

            return {
              ...produtor,
              totalIncentivos: incentivosResponse.data || 0,

            };
          } catch (error) {
            console.error(`Erro ao buscar incentivos para produtor ${produtor._id}:`, error);
            return {
              ...produtor,
              totalIncentivos: 0,
              incentivosRecebidos: []
            };
          }
        })
      );

      // Filtrar apenas produtores que têm incentivos
      const produtoresValidos = produtoresComCount.filter(produtor => produtor.totalIncentivos > 0);

      setProdutores(produtoresData);
      setProdutoresComIncentivos(produtoresValidos);

    } catch (error) {
      console.error('Erro ao buscar produtores com incentivos:', error);
      showToast('error', 'Erro', 'Erro ao carregar produtores com incentivos');
      setProdutores([]);
      setProdutoresComIncentivos([]);
    } finally {
      setLoadingProdutores(false);
    }
  }, []);

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
              statusIncentivo: detalheIncentivo?.estadoDoReembolso || 'Ativo'
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
  const buscarReembolsosModalProdutor = useCallback(async (produtorId) => {
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


  // Função para buscar incentivos do produtor
  const buscarIncentivosProdutor = useCallback(async (produtorId) => {
    try {
      const response = await axios.get(`https://mwangobrainsa-001-site2.mtempurl.com/api/incentivo/produtor/${produtorId}/incentivos`);

      // Transformar os dados da API para o formato esperado
      return response.data.map(incentivo => ({
        id: incentivo.id,
        nome: incentivo.nomeDoIncentivo,
        tipo: incentivo.tipoDoIncentivo,
        dataRecebimento: new Date().toISOString().split('T')[0], // ou usar uma data específica se disponível
        valorOriginal: incentivo.valorPorProduto || incentivo.valorDoReembolso,
        quantidadeOriginal: incentivo.quantidadePorProduto,
        unidade: incentivo.unidade || 'unidade',
        percentualReembolso: incentivo.porcentagemDeReembolso || 80,
        status: incentivo.estadoDoReembolso === 'Ativo' ? 'ATIVO' : 'INATIVO',
        motivoReembolso: ['Produto com defeito', 'Não adequado para região', 'Excesso de estoque'],
        descricao: incentivo.descricaoDoIncentivo,
        formaEntrega: incentivo.formaDeEntrega,
        dataVencimento: incentivo.dataDeVencimentoDoReembolso,
        observacoes: incentivo.observacoes
      }));
    } catch (error) {
      console.error('Erro ao buscar incentivos do produtor:', error);
      return [];
    }
  }, []);

  // Carregar produtores na inicialização
  useEffect(() => {
    buscarProdutoresComIncentivos();
  }, [buscarProdutoresComIncentivos]);

  // Filtrar produtores com base nos filtros aplicados
  const produtoresFiltrados = useMemo(() => {
    return produtoresComIncentivos.filter(produtor => {
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
  }, [produtoresComIncentivos, filtrosProdutores]);

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

  // Função para carregar uma foto específica
  const carregarFoto = useCallback(async (produtorId) => {
    if (fotosCarregadas.has(produtorId)) return;

    try {
      const resposta = await axios.get(`https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/${produtorId}/foto-beneficiary`, {
        responseType: 'blob',
        timeout: 5000 // timeout de 5 segundos
      });
      const url = URL.createObjectURL(resposta.data);

      setFotosProdutores(prev => ({ ...prev, [produtorId]: url }));
      setFotosCarregadas(prev => new Set([...prev, produtorId]));
    } catch (e) {
      console.log('Erro ao carregar foto:', e);
      setFotosCarregadas(prev => new Set([...prev, produtorId]));
    }
  }, [fotosCarregadas]);

  // Carregar fotos apenas dos produtores visíveis
  useEffect(() => {
    const produtoresParaCarregar = produtoresPaginados
      .filter(produtor => produtor._id && !fotosCarregadas.has(produtor._id))
      .slice(0, 6); // Limitar para evitar muitas requisições simultâneas

    if (produtoresParaCarregar.length > 0) {
      produtoresParaCarregar.forEach(produtor => {
        carregarFoto(produtor._id);
      });
    }
  }, [produtoresPaginados, carregarFoto]);

  // Atualizar municípios quando província muda
  useEffect(() => {
    if (filtrosProdutores.provincia) {
      const provinciaSelected = provinciasData.find(
        p => p.nome.toUpperCase() === filtrosProdutores.provincia?.toUpperCase()
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
    } else {
      setMunicipiosOptions([]);
    }
  }, [filtrosProdutores.provincia]);

  // Selecionar produtor e carregar seus incentivos
  const selecionarProdutor = async (produtor) => {
    setProdutorSelecionado(produtor);
    setIncentivoSelecionado(null);

    // Buscar incentivos reais do produtor
    const incentivos = await buscarIncentivosProdutor(produtor._id);

    // Atualizar o produtor com os incentivos reais
    const produtorComIncentivos = {
      ...produtor,
      incentivosRecebidos: incentivos
    };

    setProdutorSelecionado(produtorComIncentivos);

    showToast('success', 'Produtor Selecionado',
      `${[produtor.nome_produtor, produtor.nome_meio_produtor, produtor.sobrenome_produtor].filter(Boolean).join(' ')} selecionado com sucesso!`);
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
  // Selecionar incentivo e preencher dados automaticamente
  const selecionarIncentivo = (incentivo) => {
    setIncentivoSelecionado(incentivo);
    setDadosReembolso(prev => ({
      ...prev,
      percentualPersonalizado: incentivo.percentualReembolso.toString()
    }));
    showToast('success', 'Incentivo Selecionado', `${incentivo.nome} selecionado para reembolso!`);
  };

  // Calcular valor do reembolso
  const calcularValorReembolso = () => {
    if (!incentivoSelecionado) return 0;

    const percentual = parseFloat(dadosReembolso.percentualPersonalizado) || incentivoSelecionado.percentualReembolso;
    return (incentivoSelecionado.valorOriginal * percentual) / 100;
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

    const imagemUrl = fotosProdutores[produtor._id];

    if (imagemUrl) {
      return (
        <img
          src={imagemUrl}
          alt={nomeCompleto}
          className={`${tamanho} rounded-full object-cover shadow-lg border-2 border-white`}
          onError={() => {
            setFotosProdutores(prev => ({
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
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${incentivo.statusIncentivo === 'Ativo' ? 'bg-green-100 text-green-700' :
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
      case 0: // Seleção do Produtor com Tabela
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Seleção do Produtor</h3>
              </div>
              <p className="text-gray-600">
                Selecione o produtor que solicitou o reembolso de incentivo. Apenas produtores com incentivos activos podem solicitar reembolso.
              </p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2 text-blue-600" />
                Filtros de Busca
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <CustomInput
                  type="select"
                  label="Província"
                  value={filtrosProdutores.provincia ? { label: filtrosProdutores.provincia, value: filtrosProdutores.provincia } : null}
                  options={[
                    { label: 'Todas as Províncias', value: '' },
                    ...provinciasData.map(provincia => ({
                      label: provincia.nome,
                      value: provincia.nome
                    }))
                  ]}
                  onChange={(value) => setFiltrosProdutores(prev => ({
                    ...prev,
                    provincia: typeof value === 'object' ? value.value : value,
                    municipio: ''
                  }))}
                  placeholder="Filtrar por província"
                  iconStart={<MapPin size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Município"
                  value={filtrosProdutores.municipio ? { label: filtrosProdutores.municipio, value: filtrosProdutores.municipio } : null}
                  options={[
                    { label: 'Todos os Municípios', value: '' },
                    ...municipiosOptions
                  ]}
                  onChange={(value) => setFiltrosProdutores(prev => ({
                    ...prev,
                    municipio: typeof value === 'object' ? value.value : value
                  }))}
                  placeholder="Filtrar por município"
                  disabled={!filtrosProdutores.provincia}
                  iconStart={<MapPin size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Actividade"
                  value={filtrosProdutores.categoria ? {
                    label: filtrosProdutores.categoria === 'agricultura' ? 'Agricultura' : 'Pecuária',
                    value: filtrosProdutores.categoria
                  } : null}
                  options={[
                    { label: 'Todas as Atividades', value: '' },
                    { label: 'Agricultura', value: 'agricultura' },
                    { label: 'Pecuária', value: 'pecuaria' }
                  ]}
                  onChange={(value) => setFiltrosProdutores(prev => ({
                    ...prev,
                    categoria: typeof value === 'object' ? value.value : value
                  }))}
                  placeholder="Filtrar por actividade"
                  iconStart={<Wheat size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Nome ou BI"
                  value={filtrosProdutores.nome}
                  onChange={(value) => setFiltrosProdutores(prev => ({ ...prev, nome: value }))}
                  placeholder="Buscar por nome ou BI"
                  iconStart={<Search size={18} />}
                />
              </div>

              {/* Botão para recarregar produtores */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={buscarProdutoresComIncentivos}
                  disabled={loadingProdutores}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {loadingProdutores ? (
                    <Loader size={16} className="animate-spin mr-2" />
                  ) : (
                    <Search size={16} className="mr-2" />
                  )}
                  {loadingProdutores ? 'Carregando...' : 'Actualizar Lista'}
                </button>
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
                      <h4 className="text-lg font-semibold text-gray-800">Produtores Elegíveis para Reembolso</h4>
                      <p className="text-sm text-left text-gray-500">
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
                  <p className="text-gray-500">Buscando produtores com incentivos reembolsáveis</p>
                </div>
              ) : produtoresFiltrados.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={32} className="text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold text-gray-700 mb-2">Nenhum produtor encontrado</p>
                  <p className="text-gray-500 mb-4">Apenas produtores com incentivos ativos podem solicitar reembolso</p>
                </div>
              ) : (
                <>
                  {/* Tabela */}
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Seleção
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
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Incentivos
                          </th>
                          <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            Informações
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 text-left bg-white">
                        {produtoresPaginados.map((produtor) => {
                          const nomeCompleto = [
                            produtor.nome_produtor,
                            produtor.nome_meio_produtor,
                            produtor.sobrenome_produtor
                          ].filter(Boolean).join(' ');

                          const isSelecionado = produtorSelecionado?._id === produtor._id;

                          return (
                            <tr
                              key={produtor._id}
                              className={`hover:bg-blue-50 transition-colors cursor-pointer ${isSelecionado ? 'bg-blue-50' : ''
                                }`}
                              onClick={() => selecionarProdutor(produtor)}
                            >
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mx-auto ${isSelecionado
                                  ? 'border-blue-500 bg-blue-500'
                                  : 'border-gray-300'
                                  }`}>
                                  {isSelecionado && <Check size={12} className="text-white" />}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <AvatarProdutor produtor={produtor} />
                                  <div className="ml-4">
                                    <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line">{nomeCompleto}</div>
                                    <div className="text-xs text-gray-500">BI: {produtor.beneficiary_id_number}</div>
                                    <div className="text-xs text-gray-500">
                                      {produtor.beneficiary_phone_number && (
                                        <span className="flex items-center mt-1">
                                          <Phone className="w-3 h-3 mr-1" />
                                          {produtor.beneficiary_phone_number}
                                        </span>
                                      )}
                                    </div>
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
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex flex-col items-center">
                                  <span className="text-lg font-bold text-blue-600">{produtor.totalIncentivos}</span>
                                  <span className="text-xs text-gray-500">reembolsáveis</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    abrirModalProdutor(produtor);
                                  }}
                                  className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                  title="Ver histórico de incentivos e reembolsos"
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
                                : 'bg-white text-blue-700 hover:bg-blue-50 border border-red-200'
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
                                : 'bg-white text-blue-700 hover:bg-blue-50 border border-red-200'
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
            {produtorSelecionado && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">Produtor Selecionado</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="block font-medium text-blue-700">Nome Completo</span>
                    <span className="text-gray-700">
                      {[produtorSelecionado.nome_produtor, produtorSelecionado.nome_meio_produtor, produtorSelecionado.sobrenome_produtor].filter(Boolean).join(' ')}
                    </span>
                  </div>
                  <div>
                    <span className="block font-medium text-blue-700">Documento</span>
                    <span className="text-gray-700">{produtorSelecionado.beneficiary_id_number}</span>
                  </div>
                  <div>
                    <span className="block font-medium text-blue-700">Incentivos Reembolsáveis</span>
                    <span className="text-blue-600 font-medium">
                      {produtorSelecionado.totalIncentivos} incentivo(s)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Incentivo para Reembolso (mantido igual)
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-red-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <RotateCcw className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Seleção do Incentivo para Reembolso</h3>
              </div>
              <p className="text-gray-600">
                Escolha o incentivo que será reembolsado e configure os detalhes do reembolso. O sistema calculará automaticamente o valor baseado na percentagem.
              </p>
            </div>

            {!produtorSelecionado ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h4 className="text-lg font-semibold text-yellow-800 mb-2">Selecione um Produtor</h4>
                <p className="text-yellow-700 mb-4">É necessário selecionar um produtor antes de escolher o incentivo para reembolso.</p>
                <button
                  onClick={() => setActiveIndex(0)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors flex items-center mx-auto"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Voltar para Seleção de Produtor
                </button>
              </div>
            ) : (
              <>
                {/* Incentivos do Produtor */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Incentivos Recebidos por {[produtorSelecionado.nome_produtor, produtorSelecionado.nome_meio_produtor, produtorSelecionado.sobrenome_produtor].filter(Boolean).join(' ')}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {produtorSelecionado.incentivosRecebidos.map(incentivo => {
                      const isSelected = incentivoSelecionado?.id === incentivo.id;

                      return (
                        <div
                          key={incentivo.id}
                          className={`border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg ${isSelected
                            ? 'border-blue-500 bg-blue-50 shadow-md'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                          onClick={() => selecionarIncentivo(incentivo)}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${incentivo.tipo === 'DINHEIRO' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                              {incentivo.tipo === 'DINHEIRO' ? <DollarSign size={24} /> : <Package size={24} />}
                            </div>
                            {isSelected && (
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                <Check size={16} className="text-white" />
                              </div>
                            )}
                          </div>

                          <h5 className="font-bold text-gray-900 mb-2">{incentivo.nome}</h5>
                          <p className="text-sm text-gray-600 mb-3">
                            Recebido em: {new Date(incentivo.dataRecebimento).toLocaleDateString('pt-BR')}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Tipo:</span>
                              <span className={`font-medium ${incentivo.tipo === 'DINHEIRO' ? 'text-green-600' : 'text-blue-600'}`}>
                                {incentivo.tipo === 'DINHEIRO' ? 'Monetário' : 'Produto'}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-500">Valor Original:</span>
                              <span className="font-bold text-gray-700">
                                {incentivo.valorOriginal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                              </span>
                            </div>

                            {incentivo.tipo === 'PRODUTO' ? (
                              incentivo.quantidadeOriginal && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Quantidade:</span>
                                  <span className="font-medium text-gray-700">
                                    {incentivo.quantidadeOriginal} {incentivo.unidade}
                                  </span>
                                </div>
                              )
                            ) : null}


                            <div className="flex justify-between">
                              <span className="text-gray-500">% Reembolsável:</span>
                              <span className="font-bold text-blue-600">{incentivo.percentualReembolso}%</span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-500">Valor Reembolsável:</span>
                              <span className="font-bold text-blue-600">
                                {((incentivo.valorOriginal * incentivo.percentualReembolso) / 100).toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                              </span>
                            </div>

                            <div className="flex justify-between">
                              <span className="text-gray-500">Status:</span>
                              <span className={`font-medium px-2 py-1 rounded text-xs ${incentivo.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                {incentivo.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Detalhes do Reembolso */}
                {incentivoSelecionado && (
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 text-left">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                      Configuração do Reembolso
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <CustomInput
                          type="select"
                          label="Motivo do Reembolso"
                          value={dadosReembolso.motivoReembolso ? {
                            label: dadosReembolso.motivoReembolso,
                            value: dadosReembolso.motivoReembolso
                          } : null}
                          options={incentivoSelecionado.motivoReembolso.map(motivo => ({
                            label: motivo,
                            value: motivo
                          }))}
                          onChange={(value) => setDadosReembolso(prev => ({
                            ...prev,
                            motivoReembolso: typeof value === 'object' ? value.value : value
                          }))}
                          required
                          iconStart={<Info size={18} />}
                        />

                        <CustomInput
                          type="number"
                          label="Percentual de Reembolso (%)"
                          value={dadosReembolso.percentualPersonalizado}
                          onChange={(value) => {
                            const numValue = Math.min(Math.max(parseFloat(value) || 0, 0), incentivoSelecionado.percentualReembolso);
                            setDadosReembolso(prev => ({ ...prev, percentualPersonalizado: numValue.toString() }));
                          }}
                          placeholder={`Máximo: ${incentivoSelecionado.percentualReembolso}%`}
                          required
                          iconStart={<Percent size={18} />}
                        />

                        <CustomInput
                          type="select"
                          label="Forma de Reembolso"
                          value={dadosReembolso.formaReembolso ? {
                            label: dadosReembolso.formaReembolso === 'TRANSFERENCIA' ? 'Transferência Bancária' : 'Pagamento em Numerário',
                            value: dadosReembolso.formaReembolso
                          } : null}
                          options={[
                            { label: 'Transferência Bancária', value: 'TRANSFERENCIA' },
                            { label: 'Pagamento em Numerário', value: 'NUMERARIO' }
                          ]}
                          onChange={(value) => setDadosReembolso(prev => ({
                            ...prev,
                            formaReembolso: typeof value === 'object' ? value.value : value
                          }))}
                          iconStart={<DollarSign size={18} />}
                        />
                      </div>

                      <div className="space-y-4">
                        <CustomInput
                          type="text"
                          label="Responsável pelo Processamento"
                          value={dadosReembolso.responsavel}
                          onChange={(value) => setDadosReembolso(prev => ({ ...prev, responsavel: value }))}
                          required
                          placeholder="Nome do responsável"
                          iconStart={<User size={18} />}
                        />

                        <CustomInput
                          type="select"
                          label="Prioridade de Processamento"
                          value={dadosReembolso.prioridadeProcessamento ? {
                            label:
                              dadosReembolso.prioridadeProcessamento === 'ALTA' ? 'Alta Prioridade' :
                                dadosReembolso.prioridadeProcessamento === 'NORMAL' ? 'Prioridade Normal' :
                                  'Baixa Prioridade',
                            value: dadosReembolso.prioridadeProcessamento
                          } : null}
                          options={[
                            { label: 'Alta Prioridade', value: 'ALTA' },
                            { label: 'Prioridade Normal', value: 'NORMAL' },
                            { label: 'Baixa Prioridade', value: 'BAIXA' }
                          ]}
                          onChange={(value) => setDadosReembolso(prev => ({
                            ...prev,
                            prioridadeProcessamento: typeof value === 'object' ? value.value : value
                          }))}
                          iconStart={<Calendar size={18} />}
                        />

                        <CustomInput
                          type="date"
                          label="Data do Reembolso"
                          value={dadosReembolso.dataReembolso}
                          onChange={(value) => {
                            let error = '';
                            if (value) {
                              const hoje = new Date();
                              const dataReembolso = new Date(value);
                              // Compara apenas a parte da data (YYYY-MM-DD)
                              const hojeISO = hoje.toISOString().slice(0, 10);
                              const reembolsoISO = dataReembolso.toISOString().slice(0, 10);
                              console.log('hojeISO:', hojeISO, 'reembolsoISO:', reembolsoISO);
                              if (reembolsoISO <= hojeISO) {
                                error = 'A data do reembolso não deve ser menor ou igual que a data de hoje.';
                              }
                              console.log('Erro:', error);
                            }
                            setDadosReembolso(prev => ({ ...prev, dataReembolso: value }));
                            setErrosReembolso(prev => ({ ...prev, dataReembolso: error }));
                          }}
                          required
                          iconStart={<Calendar size={18} />}
                          helperText={errosReembolso?.dataReembolso ? (
                            <span className="text-red-600 font-medium">{errosReembolso.dataReembolso}</span>
                          ) : undefined}
                        />
                        {/* Estado para erros do reembolso */}
                      </div>
                    </div>

                    <div className="mt-6">
                      <CustomInput
                        type="textarea"
                        label="Observações Gerais"
                        value={dadosReembolso.observacoesGerais}
                        onChange={(value) => setDadosReembolso(prev => ({ ...prev, observacoesGerais: value }))}
                        placeholder="Informações adicionais sobre o reembolso..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Cálculo em Tempo Real */}
                {incentivoSelecionado && dadosReembolso.percentualPersonalizado && (
                  <div className="bg-gradient-to-r from-blue-50 to-red-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                      Cálculo do Reembolso
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <span className="block text-2xl font-bold text-gray-600 mb-1">
                          {incentivoSelecionado.valorOriginal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                        </span>
                        <span className="text-sm font-medium text-gray-600">Valor Original</span>
                      </div>

                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <span className="block text-2xl font-bold text-blue-600 mb-1">
                          {dadosReembolso.percentualPersonalizado}%
                        </span>
                        <span className="text-sm font-medium text-gray-600">Percentual</span>
                      </div>

                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <span className="block text-2xl font-bold text-green-600 mb-1">
                          {calcularValorReembolso().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                        </span>
                        <span className="text-sm font-medium text-gray-600">Valor a Reembolsar</span>
                      </div>

                      <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <span className="block text-lg font-bold text-gray-600 mb-1">
                          {dadosReembolso.formaReembolso === 'TRANSFERENCIA' ? 'Transferência' : 'Numerário'}
                        </span>
                        <span className="text-sm font-medium text-gray-600">Forma Pagamento</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );

      case 2: // Resumo e Processamento (mantido igual ao original)
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Resumo do Reembolso</h3>
              </div>
              <p className="text-gray-600">
                Revise todos os dados do reembolso antes de finalizar. Verifique se todas as informações estão corretas.
              </p>
            </div>

            <div className="space-y-6">
              {/* Resumo do Produtor */}
              {produtorSelecionado && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Dados do Produtor
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                      <p className="text-lg font-semibold text-gray-900">
                        {[produtorSelecionado.nome_produtor, produtorSelecionado.nome_meio_produtor, produtorSelecionado.sobrenome_produtor].filter(Boolean).join(' ')}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Documento de Identidade</label>
                      <p className="text-sm text-gray-900">{produtorSelecionado.beneficiary_id_number}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                      <p className="text-sm text-gray-900">{produtorSelecionado.provincia} - {produtorSelecionado.municipio}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Resumo do Incentivo */}
              {incentivoSelecionado && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Incentivo para Reembolso
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Incentivo</label>
                        <p className="text-lg font-semibold text-gray-900">{incentivoSelecionado.nome}</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tipo</label>
                        <p className={`text-sm font-medium ${incentivoSelecionado.tipo === 'DINHEIRO' ? 'text-green-600' : 'text-blue-600'}`}>
                          {incentivoSelecionado.tipo === 'DINHEIRO' ? 'Incentivo Monetário' : 'Produto/Insumo'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Data do Recebimento</label>
                        <p className="text-sm text-gray-900">
                          {new Date(incentivoSelecionado.dataRecebimento).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Valor Original</label>
                        <p className="text-xl font-bold text-gray-900">
                          {incentivoSelecionado.valorOriginal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                        </p>
                      </div>

                      {incentivoSelecionado.quantidadeOriginal && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Quantidade Original</label>
                          <p className="text-lg font-semibold text-gray-900">
                            {incentivoSelecionado.quantidadeOriginal} {incentivoSelecionado.unidade}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <p className={`text-sm font-medium px-2 py-1 rounded inline-block ${incentivoSelecionado.status === 'ATIVO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                          {incentivoSelecionado.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dados do Reembolso */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Configuração do Reembolso
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data do Reembolso</label>
                      <p className="text-sm text-gray-900">{new Date(dadosReembolso.dataReembolso).toLocaleDateString('pt-BR')}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Responsável</label>
                      <p className="text-sm text-gray-900">{dadosReembolso.responsavel || 'Não informado'}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivo do Reembolso</label>
                      <p className="text-sm text-gray-900">{dadosReembolso.motivoReembolso || 'Não informado'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prioridade de Processamento</label>
                      <p className={`text-sm font-medium ${dadosReembolso.prioridadeProcessamento === 'ALTA' ? 'text-blue-600' :
                        dadosReembolso.prioridadeProcessamento === 'NORMAL' ? 'text-yellow-600' : 'text-blue-600'
                        }`}>
                        {dadosReembolso.prioridadeProcessamento === 'ALTA' ? 'Alta Prioridade' :
                          dadosReembolso.prioridadeProcessamento === 'NORMAL' ? 'Prioridade Normal' : 'Baixa Prioridade'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Forma de Reembolso</label>
                      <p className="text-sm text-gray-900">
                        {dadosReembolso.formaReembolso === 'TRANSFERENCIA' ? 'Transferência Bancária' : 'Pagamento em Numerário'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Percentual Aplicado</label>
                      <p className="text-lg font-bold text-blue-600">{dadosReembolso.percentualPersonalizado}%</p>
                    </div>
                  </div>
                </div>

                {dadosReembolso.observacoesGerais && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Observações Gerais</label>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {dadosReembolso.observacoesGerais}
                    </p>
                  </div>
                )}
              </div>

              {/* Totais Finais */}
              {incentivoSelecionado && dadosReembolso.percentualPersonalizado && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                    Cálculo Final do Reembolso
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="block text-2xl font-bold text-gray-600 mb-1">
                        {incentivoSelecionado.valorOriginal.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                      <span className="text-sm font-medium text-gray-600">Valor Original</span>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="block text-2xl font-bold text-blue-600 mb-1">
                        {dadosReembolso.percentualPersonalizado}%
                      </span>
                      <span className="text-sm font-medium text-gray-600">Percentual</span>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="block text-2xl font-bold text-green-600 mb-1">
                        {calcularValorReembolso().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                      </span>
                      <span className="text-sm font-medium text-gray-600">Valor a Reembolsar</span>
                    </div>

                    <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                      <span className="block text-lg font-bold text-blue-600 mb-1">
                        {dadosReembolso.formaReembolso === 'TRANSFERENCIA' ? 'Transferência' : 'Numerário'}
                      </span>
                      <span className="text-sm font-medium text-gray-600">Forma Pagamento</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Aviso Final */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center text-yellow-800">
                  <AlertCircle size={20} className="mr-2" />
                  <span className="font-medium">Atenção</span>
                </div>
                <p className="text-sm text-yellow-700 mt-1">
                  Verifique cuidadosamente todos os dados antes de processar o reembolso.
                  Esta ação irá registrar oficialmente a devolução de parte do incentivo ao produtor.
                </p>
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
      // Validações básicas
      if (!produtorSelecionado) {
        showToast('error', 'Validação', 'Selecione um produtor para o reembolso');
        setLoading(false);
        return;
      }

      if (!incentivoSelecionado) {
        showToast('error', 'Validação', 'Selecione um incentivo para reembolso');
        setLoading(false);
        return;
      }

      if (!dadosReembolso.responsavel) {
        showToast('error', 'Validação', 'Informe o responsável pelo processamento');
        setLoading(false);
        return;
      }

      if (!dadosReembolso.motivoReembolso) {
        showToast('error', 'Validação', 'Selecione o motivo do reembolso');
        setLoading(false);
        return;
      }

      if (!dadosReembolso.percentualPersonalizado) {
        showToast('error', 'Validação', 'Informe o percentual de reembolso');
        setLoading(false);
        return;
      }

      // Preparar dados para envio
      const dadosParaEnvio = {
        motivoDoReembolso: dadosReembolso.motivoReembolso,
        formaDeReembolso: dadosReembolso.formaReembolso,
        responsavelPeloReembolso: dadosReembolso.responsavel,
        prioridadeDeProcesso: dadosReembolso.prioridadeProcessamento,
        dataDoReembolso: dadosReembolso.dataReembolso,
        observacoes: dadosReembolso.observacoesGerais,
        incentivoId: incentivoSelecionado.id,
        produtorId: parseInt(produtorSelecionado._id) // Garantir que seja número
      };

      console.log('Enviando dados:', dadosParaEnvio);

      // Fazer requisição para a API
      const response = await axios.post(
        'https://mwangobrainsa-001-site2.mtempurl.com/api/reembolsoDoIncentivo',
        dadosParaEnvio,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Resposta da API:', response.data);

      setLoading(false);
      showToast('success', 'Sucesso',
        `Reembolso de ${calcularValorReembolso().toLocaleString('pt-AO', {
          style: 'currency',
          currency: 'AOA'
        })} processado com sucesso!`);

      // Reset form
      setProdutorSelecionado(null);
      setIncentivoSelecionado(null);
      setActiveIndex(0);
      setDadosReembolso({
        dataReembolso: new Date().toISOString().split('T')[0],
        responsavel: '',
        motivoReembolso: '',
        percentualPersonalizado: '',
        observacoesGerais: '',
        prioridadeProcessamento: 'NORMAL',
        formaReembolso: 'TRANSFERENCIA'
      });

    } catch (error) {
      setLoading(false);
      console.error('Erro ao processar reembolso:', error);

      // Tratar diferentes tipos de erro
      if (error.response) {
        // Erro da API
        const mensagemErro = error.response.data?.message || error.response.data?.error || 'Erro no servidor';
        showToast('error', 'Erro do Servidor', `${mensagemErro} (${error.response.status})`);
      } else if (error.request) {
        // Erro de rede
        showToast('error', 'Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Outro erro
        showToast('error', 'Erro', `Erro inesperado: ${error.message}`);
      }
    }
  };

  const isLastStep = activeIndex === steps.length - 1;
  const canProceed = () => {
    switch (activeIndex) {
      case 0: return produtorSelecionado !== null;
      case 1: return incentivoSelecionado !== null && dadosReembolso.responsavel && dadosReembolso.motivoReembolso && dadosReembolso.percentualPersonalizado;
      case 2: return true;
      default: return true;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          toastMessage.severity === 'error' ? 'bg-blue-100 border-l-4 border-red-500 text-blue-700' :
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

      {/* Modal de Informações do Produtor */}
      <ModalInformacoesProdutor />

      <div className="">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-red-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Reembolso de Incentivos</h1>
            <p className="text-gray-600">Sistema de gestão e processamento de reembolsos de incentivos</p>
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
                  Processar Reembolso
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

export default ReembolsoIncentivos;