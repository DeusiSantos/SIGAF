import axios from 'axios';
import {
    AlertCircle,
    ArrowDownLeft,
    ArrowUpRight,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileCheck,
    Filter,
    Globe,
    MapPin,
    Plane,
    Search,
    Ship,
    Train,
    Truck,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';
import { gerarCertificadoOrigem } from './CertificadoOrigemDocument';

// Hook para buscar TODOS os certificados de origem
const useCertificadosOrigem = () => {
    const [certificadosData, setCertificadosData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    'https://mwangobrainsa-001-site2.mtempurl.com/api/certificadoDeOrigem/all',
                    { timeout: 10000 }
                );

                if (response.data && Array.isArray(response.data)) {
                    setCertificadosData(response.data);
                } else {
                    setCertificadosData([]);
                }
            } catch (error) {
                console.error('Erro ao buscar certificados de origem:', error);
                setError('Erro ao carregar dados dos certificados de origem');
                setCertificadosData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificados();
    }, []);

    return { certificadosData, loading, error };
};

// Função para mapear os dados da API
const mapApiDataToCertificadoOrigem = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((cert) => {
        // Normalizar tipo de operação
        const tipoOperacao = cert.tipoDeOperacao?.toLowerCase() === 'exportacao' ? 'EXPORTACAO' :
            cert.tipoDeOperacao?.toLowerCase() === 'importacao' ? 'IMPORTACAO' : 'OUTRO';

        // Traduzir via de transporte
        const getViaTransporteInfo = (via) => {
            const vias = {
                'Marítimo': { label: 'Marítimo', icon: 'ship', color: 'blue' },
                'Aéreo': { label: 'Aéreo', icon: 'plane', color: 'sky' },
                'Terrestre': { label: 'Terrestre', icon: 'truck', color: 'green' },
                'Ferroviário': { label: 'Ferroviário', icon: 'train', color: 'gray' }
            };
            return vias[via] || { label: via || 'N/A', icon: 'truck', color: 'gray' };
        };

        const viaTransporteInfo = getViaTransporteInfo(cert.viaDeTransporte);

        // Total de produtos
        const totalProdutos = cert.listaDeProdutos?.length || 0;

        // Determinar status do certificado (todos activos por padrão)
        const statusCertificado = 'ACTIVO';

        // Formatar data da alfândega
        const dataAlfandega = cert.dataAlfandega ? new Date(cert.dataAlfandega).toISOString().split('T')[0] : null;

        return {
            id: cert.id,
            numeroCertificado: `CERT-ORIG-${String(cert.id).padStart(6, '0')}`,

            // Tipo de Operação
            tipoDeOperacao: tipoOperacao,
            tipoOperacaoLabel: tipoOperacao === 'EXPORTACAO' ? 'Exportação' :
                tipoOperacao === 'IMPORTACAO' ? 'Importação' : 'Outro',

            // Partes Envolvidas
            nomeDoExportador: cert.nomeDoExportador || 'N/A',
            enderecoDoExportador: cert.enderecoDoExportador || 'N/A',
            nomeDoImportador: cert.nomeDoImportador || 'N/A',
            enderecoDoImportador: cert.enderecoDoImportador || 'N/A',
            nomeDoDestinatario: cert.nomeDoDestinatario || 'N/A',
            enderecoDoDestinatario: cert.enderecoDoDestinatario || 'N/A',

            // Localização e Transporte
            paisDeOrigem: cert.paisDeOrigem || 'N/A',
            paisDeDestino: cert.paisDeDestino || 'N/A',
            viaDeTransporte: cert.viaDeTransporte || 'N/A',
            viaTransporteLabel: viaTransporteInfo.label,
            viaTransporteIcon: viaTransporteInfo.icon,
            viaTransporteColor: viaTransporteInfo.color,
            pontoDeSaida: cert.pontoDeSaida || 'N/A',
            pontoDeEntrada: cert.pontoDeEntrada || 'N/A',

            // Documentação e Alfândega
            documentoDeCarga: cert.documentoDeCarga || 'N/A',
            alfandegaDeSaida: cert.alfandegaDeSaida || 'N/A',
            dataAlfandega: dataAlfandega,

            // Produtos
            listaDeProdutos: cert.listaDeProdutos || [],
            totalProdutos: totalProdutos,

            // Status
            statusCertificado: statusCertificado
        };
    });
};

const CertificadoDeOrigemGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipoOperacao, setSelectedTipoOperacao] = useState('');
    const [selectedViaTransporte, setSelectedViaTransporte] = useState('');
    const [selectedPaisOrigem, setSelectedPaisOrigem] = useState('');
    const [selectedPaisDestino, setSelectedPaisDestino] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [certificados, setCertificados] = useState([]);
    const itemsPerPage = 5;
    const containerRef = useRef(null);

    const { certificadosData, loading, error } = useCertificadosOrigem();

    console.log("Dados da API (certificados de origem):", certificadosData);

    // Carregar e mapear certificados quando dados mudarem
    useEffect(() => {
        if (certificadosData && certificadosData.length > 0) {
            try {
                const certificadosMapeados = mapApiDataToCertificadoOrigem(certificadosData);
                setCertificados(certificadosMapeados);
                console.log("Certificados de origem mapeados:", certificadosMapeados);
            } catch (error) {
                console.error('Erro ao mapear certificados:', error);
                showToast('error', 'Erro', 'Erro ao processar dados dos certificados');
            }
        } else {
            setCertificados([]);
        }
    }, [certificadosData]);

    const handleViewCertificado = async (cert) => {
        try {
            showToast('success', 'Gerando PDF', 'Preparando o documento...');

            // Importar a função existente do seu gerador


            // ✅ Mapear tipoDeOperacao para o formato esperado pelo PDF (exportacao/importacao/reexportacao)
            let tipoCertificado = 'exportacao'; // default

            if (cert.tipoDeOperacao) {
                const tipoLower = cert.tipoDeOperacao.toLowerCase();
                if (tipoLower === 'exportacao' || tipoLower === 'exportação') {
                    tipoCertificado = 'exportacao';
                } else if (tipoLower === 'importacao' || tipoLower === 'importação') {
                    tipoCertificado = 'importacao';
                } else if (tipoLower === 'reexportacao' || tipoLower === 'reexportação') {
                    tipoCertificado = 'reexportacao';
                } else if (tipoLower === 'string') {
                    // Caso venha "string" da API, tentar inferir pelo contexto
                    tipoCertificado = 'exportacao';
                } else {
                    tipoCertificado = tipoLower;
                }
            }

            console.log(`📋 Tipo de certificado mapeado: ${tipoCertificado} (original: ${cert.tipoDeOperacao})`);

            // Preparar formData no formato esperado
            const formData = {
                numeroCertificado: cert.numeroCertificado,
                dataValidade: cert.dataAlfandega || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                tipoOperacao: cert.tipoDeOperacao,
                exportadorNome: cert.nomeDoExportador || '',
                exportadorEndereco: cert.enderecoDoExportador || '',
                importadorNome: cert.nomeDoImportador || '',
                importadorEndereco: cert.enderecoDoImportador || '',
                destinatarioNome: cert.nomeDoDestinatario || '',
                destinatarioEndereco: cert.enderecoDoDestinatario || '',
                paisOrigem: cert.paisDeOrigem || '',
                viaTransporte: cert.viaDeTransporte || '',
                pontoSaida: cert.pontoDeSaida || '',
                paisDestino: cert.paisDeDestino || '',
                pontoEntrada: cert.pontoDeEntrada || '',
                documentoCarga: cert.documentoDeCarga || '',
                alfandegaSaida: cert.alfandegaDeSaida || '',
                dataAlfandega: cert.dataAlfandega || new Date().toISOString().split('T')[0]
            };

            // Preparar produtos no formato esperado pelo PDF
            const produtos = cert.listaDeProdutos?.map(p => ({
                nomeVulgar: p.nomeDoProduto || p.nomeVulgar || 'Produto não informado',
                nomeCientifico: p.nomeCientifico || 'Desconhecido',
                grupoQualidade: p.grupoOuQualidade || p.grupoQualidade || 'N/A',
                qualidade: p.qualidade || 'Standard',
                pesoLiquido: parseFloat(p.pesoLiquido) || 0,
                volume: parseFloat(p.volume) || 0
            })) || [];

            // ✅ Estrutura IDÊNTICA ao seu handleSubmit
            const dadosParaPDF = {
                formData: {
                    ...formData,
                    dataValidade: formData.dataValidade
                },
                tipoCertificado: tipoCertificado, // ✅ 'exportacao' | 'importacao' | 'reexportacao'
                produtos: produtos.map(p => ({
                    nomeVulgar: p.nomeVulgar,
                    nomeCientifico: p.nomeCientifico,
                    grupoQualidade: p.grupoQualidade,
                    qualidade: p.qualidade,
                    pesoLiquido: parseFloat(p.pesoLiquido) || 0,
                    volume: parseFloat(p.volume) || 0
                }))
            };

            console.log('📦 Dados preparados para PDF:', dadosParaPDF);
            console.log(`✅ Checkbox marcado: ${tipoCertificado}`);
            const resultados = await gerarCertificadoOrigem(dadosParaPDF);

            console.log(resultados)

            // Gerar o PDF usando SUA função existente
            const resultado = await gerarCertificadoOrigem(dadosParaPDF);
            console.log('✅ Resultado:', resultado);

            showToast('success', 'Sucesso', `PDF do certificado de ${tipoCertificado} gerado com sucesso!`);
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

    // Ícone da via de transporte
    const getTransportIcon = (iconName, color) => {
        const icons = {
            'ship': <Ship className={`w-5 h-5 text-${color}-600`} />,
            'plane': <Plane className={`w-5 h-5 text-${color}-600`} />,
            'truck': <Truck className={`w-5 h-5 text-${color}-600`} />,
            'train': <Train className={`w-5 h-5 text-${color}-600`} />
        };
        return icons[iconName] || <Truck className={`w-5 h-5 text-${color}-600`} />;
    };

    // Avatar do certificado
    const CertificadoAvatar = ({ certificado, size = "w-20 h-20", textSize = "text-lg" }) => {
        const getInitials = (tipo) => {
            if (tipo === 'EXPORTACAO') return 'EXP';
            if (tipo === 'IMPORTACAO') return 'IMP';
            return 'CO';
        };

        const getBgColor = (tipo) => {
            if (tipo === 'EXPORTACAO') return 'from-orange-400 to-orange-600';
            if (tipo === 'IMPORTACAO') return 'from-teal-400 to-teal-600';
            return 'from-gray-400 to-gray-600';
        };

        return (
            <div className={`${size} rounded-full bg-gradient-to-r ${getBgColor(certificado?.tipoDeOperacao)} flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {getInitials(certificado?.tipoDeOperacao)}
            </div>
        );
    };

    // Filtragem dos certificados
    const filteredCertificados = useMemo(() => {
        return certificados.filter(certificado => {
            const matchesSearch =
                certificado.numeroCertificado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.nomeDoExportador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.nomeDoImportador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.nomeDoDestinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.paisDeOrigem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.paisDeDestino.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.documentoDeCarga.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTipoOperacao = !selectedTipoOperacao || certificado.tipoDeOperacao === selectedTipoOperacao;
            const matchesViaTransporte = !selectedViaTransporte || certificado.viaDeTransporte === selectedViaTransporte;
            const matchesPaisOrigem = !selectedPaisOrigem || certificado.paisDeOrigem === selectedPaisOrigem;
            const matchesPaisDestino = !selectedPaisDestino || certificado.paisDeDestino === selectedPaisDestino;

            return matchesSearch && matchesTipoOperacao && matchesViaTransporte && matchesPaisOrigem && matchesPaisDestino;
        });
    }, [certificados, searchTerm, selectedTipoOperacao, selectedViaTransporte, selectedPaisOrigem, selectedPaisDestino]);

    // Estatísticas
    const estatisticas = useMemo(() => {
        const exportacoes = certificados.filter(c => c.tipoDeOperacao === 'EXPORTACAO');
        const importacoes = certificados.filter(c => c.tipoDeOperacao === 'IMPORTACAO');
        const outros = certificados.filter(c => c.tipoDeOperacao === 'OUTRO');

        const totalProdutos = certificados.reduce((sum, c) => sum + c.totalProdutos, 0);

        const paisesOrigem = new Set(certificados.map(c => c.paisDeOrigem).filter(p => p !== 'N/A'));
        const paisesDestino = new Set(certificados.map(c => c.paisDeDestino).filter(p => p !== 'N/A'));

        return {
            total: certificados.length,
            exportacoes: exportacoes.length,
            importacoes: importacoes.length,
            outros: outros.length,
            totalProdutos: totalProdutos,
            totalPaisesOrigem: paisesOrigem.size,
            totalPaisesDestino: paisesDestino.size
        };
    }, [certificados]);

    // Reset página quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedTipoOperacao, selectedViaTransporte, selectedPaisOrigem, selectedPaisDestino]);

    // Paginação
    const totalPages = Math.ceil(filteredCertificados.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredCertificados.slice(startIndex, endIndex);
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return 'N/A';
        }
    };

    // Exportar dados
    const handleExportData = () => {
        try {
            const dataToExport = filteredCertificados.map(cert => ({
                'Número do Certificado': cert.numeroCertificado,
                'Tipo de Operação': cert.tipoOperacaoLabel,
                'Exportador': cert.nomeDoExportador,
                'Endereço Exportador': cert.enderecoDoExportador,
                'Importador': cert.nomeDoImportador,
                'Endereço Importador': cert.enderecoDoImportador,
                'Destinatário': cert.nomeDoDestinatario,
                'Endereço Destinatário': cert.enderecoDoDestinatario,
                'País de Origem': cert.paisDeOrigem,
                'País de Destino': cert.paisDeDestino,
                'Via de Transporte': cert.viaTransporteLabel,
                'Ponto de Saída': cert.pontoDeSaida,
                'Ponto de Entrada': cert.pontoDeEntrada,
                'Documento de Carga': cert.documentoDeCarga,
                'Alfândega de Saída': cert.alfandegaDeSaida,
                'Data Alfândega': formatDate(cert.dataAlfandega),
                'Total de Produtos': cert.totalProdutos,
                'Status': cert.statusCertificado
            }));

            const csv = [
                Object.keys(dataToExport[0]).join(','),
                ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `certificados_origem_${new Date().toISOString().split('T')[0]}.csv`);
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
    const viasTransporteUnicas = [...new Set(
        certificados.map(c => c.viaDeTransporte)
    )].filter(Boolean);

    const paisesOrigemUnicos = [...new Set(
        certificados.map(c => c.paisDeOrigem)
    )].filter(p => p !== 'N/A');

    const paisesDestinoUnicos = [...new Set(
        certificados.map(c => c.paisDeDestino)
    )].filter(p => p !== 'N/A');

    return (
        <div>
            <Toast />

            {/* Estatísticas */}
            {!loading && certificados.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <FileCheck className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total Certificados</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-orange-100 rounded-full">
                                <ArrowUpRight className="w-6 h-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Exportações</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.exportacoes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-teal-100 rounded-full">
                                <ArrowDownLeft className="w-6 h-6 text-teal-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Importações</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.importacoes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Globe className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Produtos</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalProdutos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <MapPin className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Países Origem</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalPaisesOrigem}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <MapPin className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Países Destino</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalPaisesDestino}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Certificados de Origem</h1>
                            <p className="text-indigo-100 mt-1">Controle de certificados para exportação e importação</p>
                        </div>
                        <button
                            onClick={handleExportData}
                            disabled={certificados.length === 0}
                            className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                        >
                            <Download className="w-5 h-5 mr-2" />
                            Exportar
                        </button>
                    </div>
                </div>

                {/* Barra de filtros */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Busca */}
                        <div>
                            <CustomInput
                                type="text"
                                placeholder="Pesquisar por exportador, país..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo de Operação */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Operação"
                                value={selectedTipoOperacao ? {
                                    label: selectedTipoOperacao === 'EXPORTACAO' ? 'Exportação' :
                                        selectedTipoOperacao === 'IMPORTACAO' ? 'Importação' : 'Outro',
                                    value: selectedTipoOperacao
                                } : null}
                                options={[
                                    { label: 'Todas as Operações', value: '' },
                                    { label: 'Exportação', value: 'EXPORTACAO' },
                                    { label: 'Importação', value: 'IMPORTACAO' },
                                    { label: 'Outro', value: 'OUTRO' }
                                ]}
                                onChange={(option) => setSelectedTipoOperacao(option?.value || '')}
                                iconStart={<Filter size={18} />}
                            />
                        </div>

                        {/* Filtro Via de Transporte */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Via de Transporte"
                                value={selectedViaTransporte ? {
                                    label: certificados.find(c => c.viaDeTransporte === selectedViaTransporte)?.viaTransporteLabel || selectedViaTransporte,
                                    value: selectedViaTransporte
                                } : null}
                                options={[
                                    { label: 'Todas as Vias', value: '' },
                                    ...viasTransporteUnicas.map(via => ({
                                        label: certificados.find(c => c.viaDeTransporte === via)?.viaTransporteLabel || via,
                                        value: via
                                    }))
                                ]}
                                onChange={(option) => setSelectedViaTransporte(option?.value || '')}
                                iconStart={<Ship size={18} />}
                            />
                        </div>

                        {/* Filtro País de Origem */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="País de Origem"
                                value={selectedPaisOrigem ? { label: selectedPaisOrigem, value: selectedPaisOrigem } : null}
                                options={[
                                    { label: 'Todos os Países', value: '' },
                                    ...paisesOrigemUnicos.map(pais => ({
                                        label: pais,
                                        value: pais
                                    }))
                                ]}
                                onChange={(option) => setSelectedPaisOrigem(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        {/* Filtro País de Destino */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="País de Destino"
                                value={selectedPaisDestino ? { label: selectedPaisDestino, value: selectedPaisDestino } : null}
                                options={[
                                    { label: 'Todos os Países', value: '' },
                                    ...paisesDestinoUnicos.map(pais => ({
                                        label: pais,
                                        value: pais
                                    }))
                                ]}
                                onChange={(option) => setSelectedPaisDestino(option?.value || '')}
                                iconStart={<Globe size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            <span className="ml-3 text-gray-600">Carregando certificados...</span>
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Certificado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Partes Envolvidas</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Origem → Destino</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Transporte</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Alfândega</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Acção</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-start bg-white">
                                {getCurrentItems().map((cert) => (
                                    <tr key={cert.id} className="hover:bg-indigo-50 transition-colors text-s">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <CertificadoAvatar certificado={cert} size="w-16 h-16" textSize="text-lg" />
                                                <div className="ml-3">
                                                    <div className="text-sm font-semibold text-gray-900">{cert.numeroCertificado}</div>
                                                    <div className="flex items-center mt-1">
                                                        {cert.tipoDeOperacao === 'EXPORTACAO' ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300 flex items-center">
                                                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                                                {cert.tipoOperacaoLabel}
                                                            </span>
                                                        ) : cert.tipoDeOperacao === 'IMPORTACAO' ? (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-300 flex items-center">
                                                                <ArrowDownLeft className="w-3 h-3 mr-1" />
                                                                {cert.tipoOperacaoLabel}
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                                                                {cert.tipoOperacaoLabel}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        Doc: {cert.documentoDeCarga}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Exportador:</span>
                                                    <div className="text-gray-600">{cert.nomeDoExportador}</div>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Importador:</span>
                                                    <div className="text-gray-600">{cert.nomeDoImportador}</div>
                                                </div>
                                                <div className="text-xs">
                                                    <span className="font-medium text-gray-700">Destinatário:</span>
                                                    <div className="text-gray-600">{cert.nomeDoDestinatario}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="text-xs">
                                                    <div className="font-medium text-gray-700">{cert.paisDeOrigem}</div>
                                                    <div className="text-gray-500">{cert.pontoDeSaida}</div>
                                                </div>
                                                <ArrowUpRight className="w-4 h-4 text-gray-400" />
                                                <div className="text-xs">
                                                    <div className="font-medium text-gray-700">{cert.paisDeDestino}</div>
                                                    <div className="text-gray-500">{cert.pontoDeEntrada}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {cert.viaTransporteIcon === 'ship' && <Ship className="w-5 h-5 text-blue-600" />}
                                                {cert.viaTransporteIcon === 'plane' && <Plane className="w-5 h-5 text-sky-600" />}
                                                {cert.viaTransporteIcon === 'truck' && <Truck className="w-5 h-5 text-green-600" />}
                                                {cert.viaTransporteIcon === 'train' && <Train className="w-5 h-5 text-gray-600" />}
                                                <div>
                                                    <div className="text-xs font-medium text-gray-700">{cert.viaTransporteLabel}</div>
                                                    {cert.totalProdutos > 0 && (
                                                        <div className="text-xs text-gray-500">
                                                            {cert.totalProdutos} {cert.totalProdutos === 1 ? 'produto' : 'produtos'}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-xs">
                                                <div className="font-medium text-gray-700">{cert.alfandegaDeSaida}</div>
                                                <div className="flex items-center text-gray-500 mt-1">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    {formatDate(cert.dataAlfandega)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleViewCertificado(cert)}
                                                    className="p-2 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 rounded-full transition-colors"
                                                    title="Ver detalhes do certificado de origem"
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
                {!loading && filteredCertificados.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Mostrando <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                                {' '}a <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredCertificados.length)}</span>
                                {' '}de <span className="font-medium">{filteredCertificados.length}</span> resultados
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
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
                {!loading && filteredCertificados.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <FileCheck className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {certificados.length === 0 ? 'Nenhum certificado encontrado' : 'Nenhum resultado encontrado'}
                        </h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            {certificados.length === 0
                                ? 'Ainda não existem certificados de origem registados no sistema.'
                                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros.'}
                        </p>
                        {(searchTerm || selectedTipoOperacao || selectedViaTransporte || selectedPaisOrigem || selectedPaisDestino) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTipoOperacao('');
                                    setSelectedViaTransporte('');
                                    setSelectedPaisOrigem('');
                                    setSelectedPaisDestino('');
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
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

export default CertificadoDeOrigemGestao;