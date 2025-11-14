import axios from 'axios';
import {
    AlertCircle,
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Download,
    Eye,
    FileText,
    Filter,
    MapPin,
    Search,
    ShoppingCart,
    Trees,
    User,
    X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';
import { gerarAutorizacaoDesalfandegamento } from './AutorizacaoDesalfandegamentoDocument';

// Hook para buscar TODAS as declarações florestais de importação
const useDeclaracoesFlorestaisImportacao = () => {
    const [declaracoesData, setDeclaracoesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDeclaracoes = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    'http://mwangobrainsa-001-site2.mtempurl.com/api/declaracaoFlorestal/all',
                    { timeout: 10000 }
                );

                if (response.data && Array.isArray(response.data)) {
                    setDeclaracoesData(response.data);
                } else {
                    setDeclaracoesData([]);
                }
            } catch (error) {
                console.error('Erro ao buscar declarações florestais de importação:', error);
                setError('Erro ao carregar dados das declarações florestais de importação');
                setDeclaracoesData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchDeclaracoes();
    }, []);

    return { declaracoesData, loading, error };
};

// Função para mapear os dados da API
const mapApiDataToDeclaracaoFlorestal = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((decl) => {
        // Determinar tipo de entidade
        const tipoEntidade = decl.produtorFlorestalId !== null ? 'PRODUTOR' :
            decl.organizacaoId !== null ? 'ORGANIZACAO' : 'DESCONHECIDO';

        // Calcular totais das mercadorias
        const totalMercadorias = decl.listaDeMercadorias?.length || 0;
        const quantidadeTotal = decl.listaDeMercadorias?.reduce((sum, merc) => sum + (merc.quantidade || 0), 0) || 0;

        const valorTotalAOA = decl.listaDeMercadorias?.reduce((sum, merc) => {
            if (merc.moeda === 'AOA') {
                return sum + (merc.total || 0);
            }
            return sum;
        }, 0) || 0;

        const valorTotalUSD = decl.listaDeMercadorias?.reduce((sum, merc) => {
            if (merc.moeda === 'USD') {
                return sum + (merc.total || 0);
            }
            return sum;
        }, 0) || 0;

        const valorTotalEUR = decl.listaDeMercadorias?.reduce((sum, merc) => {
            if (merc.moeda === 'EUR') {
                return sum + (merc.total || 0);
            }
            return sum;
        }, 0) || 0;

        // Calcular valor total geral (convertendo tudo para AOA - pode ajustar taxas de câmbio)
        const valorTotalGeral = valorTotalAOA + (valorTotalUSD * 850) + (valorTotalEUR * 950);

        // Obter moedas únicas utilizadas
        const moedasUtilizadas = [...new Set(decl.listaDeMercadorias?.map(m => m.moeda))].filter(Boolean);

        // Obter origens únicas
        const origensUnicas = [...new Set(decl.listaDeMercadorias?.map(m => m.origem))].filter(Boolean);

        // Obter nomes únicos de mercadorias
        const mercadoriasUnicas = [...new Set(decl.listaDeMercadorias?.map(m => m.nomeDaMercadoria))].filter(Boolean);

        // Determinar status da declaração (todos activos por padrão - pode adicionar lógica)
        const statusDeclaracao = 'ACTIVO';

        return {
            id: decl.id,
            numeroDeclaracao: `DECL-IMP-${String(decl.id).padStart(6, '0')}`,

            // Informações do Importador
            nomeCompleto: decl.nomeCompleto || 'Nome não informado',
            nif: decl.nif || 'N/A',
            endereco: decl.endereco || 'N/A',
            provincia: decl.provincia || 'N/A',
            municipio: decl.municipio || 'N/A',

            // Identificadores de Entidade
            produtorFlorestalId: decl.produtorFlorestalId,
            organizacaoId: decl.organizacaoId,
            entidadeId: decl.produtorFlorestalId || decl.organizacaoId,
            tipoEntidade: tipoEntidade,

            // Lista de Mercadorias
            listaDeMercadorias: decl.listaDeMercadorias || [],

            // Totalizadores
            totalMercadorias: totalMercadorias,
            quantidadeTotal: quantidadeTotal,
            valorTotalAOA: valorTotalAOA,
            valorTotalUSD: valorTotalUSD,
            valorTotalEUR: valorTotalEUR,
            valorTotalGeral: valorTotalGeral,
            moedasUtilizadas: moedasUtilizadas,
            origensUnicas: origensUnicas,
            mercadoriasUnicas: mercadoriasUnicas,

            // Status
            statusDeclaracao: statusDeclaracao,

            // Campos auxiliares
            importador: {
                nome: decl.nomeCompleto || 'Nome não informado',
                nif: decl.nif || 'N/A',
                endereco: decl.endereco || 'N/A',
                provincia: decl.provincia || 'N/A',
                municipio: decl.municipio || 'N/A'
            }
        };
    });
};

const EmitidoImportacaoGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipoEntidade, setSelectedTipoEntidade] = useState('');
    const [selectedMoeda, setSelectedMoeda] = useState('');
    const [selectedOrigem, setSelectedOrigem] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [declaracoes, setDeclaracoes] = useState([]);
    const itemsPerPage = 5;
    const containerRef = useRef(null);

    const { declaracoesData, loading, error } = useDeclaracoesFlorestaisImportacao();

    console.log("Dados da API (declarações florestais de importação):", declaracoesData);

    // Carregar e mapear declarações quando dados mudarem
    // Carregar e mapear declarações quando dados mudarem
    useEffect(() => {
        const carregarDeclaracoesComProdutores = async () => {
            if (declaracoesData && declaracoesData.length > 0) {
                try {
                    const declaracoesMapeadas = mapApiDataToDeclaracaoFlorestal(declaracoesData);

                    // Buscar dados dos produtores para preencher nomes
                    const declaracoesComNomes = await Promise.all(
                        declaracoesMapeadas.map(async (decl) => {
                            // Se tiver produtorFlorestalId, buscar dados do produtor
                            if (decl.produtorFlorestalId) {
                                try {
                                    const produtorResponse = await axios.get(
                                        `http://mwangobrainsa-001-site2.mtempurl.com/api/produtorFlorestal/${decl.produtorFlorestalId}`,
                                        { timeout: 5000 }
                                    );

                                    if (produtorResponse.data) {
                                        const produtorData = produtorResponse.data;

                                        // Atualizar com dados reais do produtor
                                        return {
                                            ...decl,
                                            nomeCompleto: produtorData.nome_do_Produtor || 'Nome não disponível',
                                            nif: produtorData.bI_NIF || 'BI/NIF não disponível',
                                            provincia: produtorData.provincia || decl.provincia,
                                            municipio: produtorData.municipio || decl.municipio,
                                            importador: {
                                                nome: produtorData.nome_do_Produtor || 'Nome não disponível',
                                                nif: produtorData.bI_NIF || 'BI/NIF não disponível',
                                                endereco: decl.endereco,
                                                provincia: produtorData.provincia || decl.provincia,
                                                municipio: produtorData.municipio || decl.municipio
                                            }
                                        };
                                    }
                                } catch (error) {
                                    console.error(`Erro ao buscar produtor ${decl.produtorFlorestalId}:`, error);
                                }
                            }

                            // Se não for produtor ou der erro, retornar como está
                            return decl;
                        })
                    );

                    setDeclaracoes(declaracoesComNomes);
                    console.log("Declarações florestais de importação com nomes dos produtores:", declaracoesComNomes);
                } catch (error) {
                    console.error('Erro ao mapear declarações:', error);
                    showToast('error', 'Erro', 'Erro ao processar dados das declarações');
                }
            } else {
                setDeclaracoes([]);
            }
        };

        carregarDeclaracoesComProdutores();
    }, [declaracoesData]);

    const handleViewDeclaracao = async (decl) => {
        try {
            showToast('success', 'Gerando PDF', 'Preparando o documento...');

            // Determinar se é produtor existente
            const isProdutorExistente = decl.produtorFlorestalId !== null;

            let produtorSelecionado = null;
            let formData = {
                nome: decl.nomeCompleto,
                nif: decl.nif,
                endereco: decl.endereco,
                provincia: decl.provincia,
                municipio: decl.municipio,
                produtorId: decl.produtorFlorestalId
            };

            // Se for produtor existente, buscar dados do produtor
            if (isProdutorExistente) {
                try {
                    showToast('info', 'Carregando', 'Buscando dados do produtor...');

                    const produtorResponse = await axios.get(
                        `http://mwangobrainsa-001-site2.mtempurl.com/api/produtorFlorestal/${decl.produtorFlorestalId}`,
                        { timeout: 10000 }
                    );

                    if (produtorResponse.data) {
                        const produtorData = produtorResponse.data;

                        // Montar produtorSelecionado com dados reais da API
                        produtorSelecionado = {
                            id: decl.produtorFlorestalId,
                            nome: produtorData.nome_do_Produtor || 'Nome não disponível',
                            bi: produtorData.bI_NIF || 'BI/NIF não disponível',
                            provincia: produtorData.provincia || decl.provincia,
                            municipio: produtorData.municipio || decl.municipio
                        };

                        // Atualizar formData também com os dados corretos
                        formData = {
                            nome: produtorData.nome_do_Produtor || decl.nomeCompleto,
                            nif: produtorData.bI_NIF || decl.nif,
                            endereco: decl.endereco,
                            provincia: produtorData.provincia || decl.provincia,
                            municipio: produtorData.municipio || decl.municipio,
                            produtorId: decl.produtorFlorestalId
                        };

                        console.log('✅ Dados do produtor carregados:', produtorData);
                    } else {
                        throw new Error('Dados do produtor não encontrados');
                    }
                } catch (produtorError) {
                    console.error('❌ Erro ao buscar dados do produtor:', produtorError);
                    showToast('warning', 'Aviso', 'Não foi possível carregar todos os dados do produtor. Usando dados da declaração.');

                    // Fallback: usar dados da declaração mesmo que sejam null
                    produtorSelecionado = {
                        id: decl.produtorFlorestalId,
                        nome: decl.nomeCompleto || 'Nome não disponível',
                        bi: decl.nif || 'BI/NIF não disponível',
                        provincia: decl.provincia,
                        municipio: decl.municipio
                    };
                }
            }

            // Preparar mercadorias no formato correto
            const mercadorias = decl.listaDeMercadorias?.map(m => ({
                mercadoria: m.nomeDaMercadoria,
                quantidade: m.quantidade,
                valor: m.valorUnitario,
                moeda: m.moeda,
                origem: m.origem,
                total: m.total
            })) || [];

            // ✅ Estrutura IDÊNTICA ao seu handleSubmit
            const dadosParaPDF = {
                isProdutorExistente,
                produtorSelecionado,
                formData,
                mercadorias,
            };

            console.log('📦 Dados preparados para PDF:', dadosParaPDF);

            // Gerar o PDF usando SUA função existente
            const resultado = await gerarAutorizacaoDesalfandegamento(dadosParaPDF);
            console.log('✅ Resultado:', resultado);

            showToast('success', 'Sucesso', 'PDF gerado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao gerar PDF:', error);
            showToast('error', 'Erro', 'Erro ao gerar PDF: ' + error.message);
        }
    };

    // Função para mostrar toast
    const showToast = (type, title, message) => {
        setToastMessage({ type, title, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Avatar do importador
    const ImportadorAvatar = ({ importador, size = "w-20 h-20", textSize = "text-lg" }) => {
        const getInitials = (nome) => {
            if (!nome || nome === 'Nome não informado') return 'DF';
            return nome.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        };

        return (
            <div className={`${size} rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {getInitials(importador?.nome)}
            </div>
        );
    };

    // Filtragem das declarações
    const filteredDeclaracoes = useMemo(() => {
        return declaracoes.filter(declaracao => {
            const matchesSearch =
                declaracao.numeroDeclaracao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                declaracao.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                declaracao.nif.toLowerCase().includes(searchTerm.toLowerCase()) ||
                declaracao.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
                declaracao.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
                declaracao.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                declaracao.listaDeMercadorias.some(merc =>
                    merc.nomeDaMercadoria?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    merc.origem?.toLowerCase().includes(searchTerm.toLowerCase())
                );

            const matchesTipoEntidade = !selectedTipoEntidade || declaracao.tipoEntidade === selectedTipoEntidade;
            const matchesMoeda = !selectedMoeda || declaracao.moedasUtilizadas.includes(selectedMoeda);
            const matchesOrigem = !selectedOrigem || declaracao.origensUnicas.includes(selectedOrigem);

            return matchesSearch && matchesTipoEntidade && matchesMoeda && matchesOrigem;
        });
    }, [declaracoes, searchTerm, selectedTipoEntidade, selectedMoeda, selectedOrigem]);

    // Estatísticas
    const estatisticas = useMemo(() => {
        const produtores = declaracoes.filter(d => d.tipoEntidade === 'PRODUTOR');
        const organizacoes = declaracoes.filter(d => d.tipoEntidade === 'ORGANIZACAO');

        const totalMercadorias = declaracoes.reduce((sum, d) => sum + d.totalMercadorias, 0);
        const totalQuantidades = declaracoes.reduce((sum, d) => sum + d.quantidadeTotal, 0);

        const totalValorAOA = declaracoes.reduce((sum, d) => sum + d.valorTotalAOA, 0);
        const totalValorUSD = declaracoes.reduce((sum, d) => sum + d.valorTotalUSD, 0);
        const totalValorEUR = declaracoes.reduce((sum, d) => sum + d.valorTotalEUR, 0);
        const totalValorGeral = declaracoes.reduce((sum, d) => sum + d.valorTotalGeral, 0);

        return {
            total: declaracoes.length,
            produtores: produtores.length,
            organizacoes: organizacoes.length,
            totalMercadorias: totalMercadorias,
            totalQuantidades: totalQuantidades,
            totalValorAOA: totalValorAOA,
            totalValorUSD: totalValorUSD,
            totalValorEUR: totalValorEUR,
            totalValorGeral: totalValorGeral
        };
    }, [declaracoes]);

    // Reset página quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedTipoEntidade, selectedMoeda, selectedOrigem]);

    // Paginação
    const totalPages = Math.ceil(filteredDeclaracoes.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredDeclaracoes.slice(startIndex, endIndex);
    };

    // Exportar dados
    const handleExportData = () => {
        try {
            const dataToExport = filteredDeclaracoes.map(decl => {
                const mercadoriasStr = decl.listaDeMercadorias
                    .map(m => `${m.nomeDaMercadoria} (Qtd: ${m.quantidade}, Valor Unit.: ${m.valorUnitario} ${m.moeda}, Total: ${m.total} ${m.moeda})`)
                    .join('; ');

                return {
                    'Tipo': decl.tipoEntidade === 'PRODUTOR' ? 'Produtor' : 'Organização',
                    'Número da Declaração': decl.numeroDeclaracao,
                    'Nome Completo': decl.nomeCompleto,
                    'NIF': decl.nif,
                    'Endereço': decl.endereco,
                    'Província': decl.provincia,
                    'Município': decl.municipio,
                    'Total de Mercadorias': decl.totalMercadorias,
                    'Quantidade Total': decl.quantidadeTotal,
                    'Valor Total AOA': decl.valorTotalAOA,
                    'Valor Total USD': decl.valorTotalUSD,
                    'Valor Total EUR': decl.valorTotalEUR,
                    'Valor Total Geral (AOA)': decl.valorTotalGeral.toFixed(2),
                    'Mercadorias': mercadoriasStr,
                    'Origens': decl.origensUnicas.join(', '),
                    'Moedas': decl.moedasUtilizadas.join(', ')
                };
            });

            const csv = [
                Object.keys(dataToExport[0]).join(','),
                ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `declaracoes_florestais_importacao_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            showToast('success', 'Sucesso', 'Dados exportados com sucesso!');
        } catch (error) {
            console.error('Erro ao exportar:', error);
            showToast('error', 'Erro', 'Erro ao exportar dados');
        }
    };

    // Toast
    const Toast = () => {
        if (!toastMessage) return null;
        const { type, title, message } = toastMessage;

        const bgColor = type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' :
            'bg-red-50 border-l-4 border-red-500 text-red-700';
        const icon = type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />;

        return (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor}`}>
                <div className="flex items-center">
                    <div className="mr-3">{icon}</div>
                    <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                    <button className="ml-auto p-1 hover:bg-gray-200 rounded-full" onClick={() => setToastMessage(null)}>
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    // Opções para filtros
    const moedasUnicas = [...new Set(
        declaracoes.flatMap(d => d.moedasUtilizadas)
    )].filter(Boolean);

    const origensUnicas = [...new Set(
        declaracoes.flatMap(d => d.origensUnicas)
    )].filter(Boolean);

    return (
        <div>
            <Toast />

            {/* Estatísticas */}
            {!loading && declaracoes.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-emerald-100 rounded-full">
                                <FileText className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Declarações</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Produtores</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.produtores}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <Building2 className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Organizações</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.organizacoes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Trees className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Mercadorias</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalMercadorias}</p>
                            </div>
                        </div>
                    </div>

                    {/* Cards de Valores por Moeda */}
                    {estatisticas.totalValorAOA > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Valor Total (AOA)</p>
                                    <p className="text-xl font-bold text-gray-900">{estatisticas.totalValorAOA.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {estatisticas.totalValorUSD > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-emerald-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Valor Total (USD)</p>
                                    <p className="text-xl font-bold text-gray-900">${estatisticas.totalValorUSD.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {estatisticas.totalValorEUR > 0 && (
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-cyan-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-cyan-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Valor Total (EUR)</p>
                                    <p className="text-xl font-bold text-gray-900">€{estatisticas.totalValorEUR.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <ShoppingCart className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Quantidade Total</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalQuantidades.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Declarações Florestais - Importação</h1>
                            <p className="text-emerald-100 mt-1">Declarações florestais emitidas para importação de produtos florestais</p>
                        </div>
                        <button
                            onClick={handleExportData}
                            disabled={declaracoes.length === 0}
                            className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Barra de filtros */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Busca */}
                        <div>
                            <CustomInput
                                type="text"
                                placeholder="Pesquisar por nome, NIF, mercadoria..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo de Entidade */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Entidade"
                                value={selectedTipoEntidade ? {
                                    label: selectedTipoEntidade === 'PRODUTOR' ? 'Produtores' : 'Organizações',
                                    value: selectedTipoEntidade
                                } : null}
                                options={[
                                    { label: 'Todos (Produtores e Organizações)', value: '' },
                                    { label: 'Apenas Produtores', value: 'PRODUTOR' },
                                    { label: 'Apenas Organizações', value: 'ORGANIZACAO' }
                                ]}
                                onChange={(option) => setSelectedTipoEntidade(option?.value || '')}
                                iconStart={<Filter size={18} />}
                            />
                        </div>

                        {/* Filtro Moeda */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Moeda"
                                value={selectedMoeda ? { label: selectedMoeda, value: selectedMoeda } : null}
                                options={[
                                    { label: 'Todas as Moedas', value: '' },
                                    ...moedasUnicas.map(moeda => ({
                                        label: moeda,
                                        value: moeda
                                    }))
                                ]}
                                onChange={(option) => setSelectedMoeda(option?.value || '')}
                                iconStart={<DollarSign size={18} />}
                            />
                        </div>

                        {/* Filtro Origem */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Origem"
                                value={selectedOrigem ? { label: selectedOrigem, value: selectedOrigem } : null}
                                options={[
                                    { label: 'Todas as Origens', value: '' },
                                    ...origensUnicas.map(origem => ({
                                        label: origem,
                                        value: origem
                                    }))
                                ]}
                                onChange={(option) => setSelectedOrigem(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                            <span className="ml-3 text-gray-600">Carregando declarações...</span>
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Importador</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Declaração</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Mercadorias</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Valores</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Acção</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-start bg-white">
                                {getCurrentItems().map((decl) => (
                                    <tr key={decl.id} className="hover:bg-emerald-50 transition-colors text-s">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <ImportadorAvatar importador={decl.importador} size="w-20 h-20" textSize="text-xl" />
                                                <div className="ml-3">
                                                    <div className="text-sm font-semibold text-gray-900">{decl.nomeCompleto}</div>
                                                    <div className="text-xs text-gray-600">NIF: {decl.nif}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {decl.tipoEntidade === 'PRODUTOR' ? 'Produtor Florestal' : 'Organização'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{decl.numeroDeclaracao}</div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                {decl.totalMercadorias} {decl.totalMercadorias === 1 ? 'produto' : 'produtos'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Qtd total: {decl.quantidadeTotal}
                                            </div>
                                            <div className="mt-1">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                    {decl.statusDeclaracao}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-700">
                                                {decl.provincia !== 'N/A' ? decl.provincia : 'Província não informada'}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {decl.municipio !== 'N/A' ? decl.municipio : 'Município não informado'}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {decl.endereco !== 'N/A' && decl.endereco !== ', ' ? decl.endereco : 'Endereço não informado'}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {decl.listaDeMercadorias.slice(0, 2).map((merc, idx) => (
                                                    <div key={idx} className="text-xs">
                                                        <span className="font-medium text-gray-700">{merc.nomeDaMercadoria}</span>
                                                        <div className="text-gray-600">
                                                            Qtd: {merc.quantidade} | Origem: {merc.origem}
                                                        </div>
                                                        <div className="text-gray-500">
                                                            {merc.valorUnitario} {merc.moeda}/un
                                                        </div>
                                                    </div>
                                                ))}
                                                {decl.listaDeMercadorias.length > 2 && (
                                                    <div className="text-xs text-emerald-600 font-medium">
                                                        +{decl.listaDeMercadorias.length - 2} mais
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                {decl.valorTotalAOA > 0 && (
                                                    <div className="text-xs text-gray-700 font-medium">
                                                        AOA: {decl.valorTotalAOA.toLocaleString()}
                                                    </div>
                                                )}
                                                {decl.valorTotalUSD > 0 && (
                                                    <div className="text-xs text-gray-700 font-medium">
                                                        USD: ${decl.valorTotalUSD.toLocaleString()}
                                                    </div>
                                                )}
                                                {decl.valorTotalEUR > 0 && (
                                                    <div className="text-xs text-gray-700 font-medium">
                                                        EUR: €{decl.valorTotalEUR.toLocaleString()}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-500 pt-1 border-t border-gray-200">
                                                    Total: {decl.valorTotalGeral.toLocaleString()} AOA
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleViewDeclaracao(decl)}
                                                    className="p-2 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 rounded-full transition-colors"
                                                    title="Ver detalhes da declaração florestal de importação"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Paginação */}
                {!loading && filteredDeclaracoes.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                                {' '}a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredDeclaracoes.length)}</span>
                                {' '}de <span className="font-medium">{filteredDeclaracoes.length}</span> resultados
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                                        }`}
                                >
                                    Próximo
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Nenhum resultado */}
                {!loading && filteredDeclaracoes.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <FileText className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {declaracoes.length === 0 ? 'Nenhuma declaração encontrada' : 'Nenhum resultado encontrado'}
                        </h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            {declaracoes.length === 0
                                ? 'Ainda não existem declarações florestais de importação registadas no sistema.'
                                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros.'}
                        </p>
                        {(searchTerm || selectedTipoEntidade || selectedMoeda || selectedOrigem) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTipoEntidade('');
                                    setSelectedMoeda('');
                                    setSelectedOrigem('');
                                }}
                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmitidoImportacaoGestao;