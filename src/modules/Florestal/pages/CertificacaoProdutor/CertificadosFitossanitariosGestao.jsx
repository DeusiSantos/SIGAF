import axios from 'axios';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Package,
    Plane,
    Search,
    Ship,
    Train,
    Truck,
    X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';

// Hook para buscar TODOS os certificados fitossanitários
const useCertificadosFitossanitarios = () => {
    const [certificadosData, setCertificadosData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    'http://mwangobrainsa-001-site2.mtempurl.com/api/certificaoFitossanitario/all',
                    { timeout: 10000 }
                );

                if (response.data && Array.isArray(response.data)) {
                    setCertificadosData(response.data);
                } else {
                    setCertificadosData([]);
                }
            } catch (error) {
                console.error('Erro ao buscar certificados fitossanitários:', error);
                setError('Erro ao carregar dados dos certificados fitossanitários');
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
const mapApiDataToCertificadoFitossanitario = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((cert) => {
        const hoje = new Date();
        const dataEmissao = new Date(cert.dataDeEmissao);

        // Calcular idade do certificado em dias
        const idadeCertificado = Math.ceil((hoje - dataEmissao) / (1000 * 60 * 60 * 24));

        // Determinar status baseado na idade (certificados fitossanitários geralmente válidos por 14 dias)
        const getStatusCertificado = (dataEmissao, idadeDias) => {
            if (idadeDias > 14) return 'EXPIRADO';
            if (idadeDias > 10) return 'PROXIMO_CADUCIDADE';
            if (idadeDias < 0) return 'AGUARDANDO_VIGENCIA';
            return 'ACTIVO';
        };

        // Traduzir meio de transporte
        const getMeioTransporteLabel = (meio) => {
            const meios = {
                'MARITIMO': 'Marítimo',
                'AEREO': 'Aéreo',
                'TERRESTRE': 'Terrestre',
                'FERROVIARIO': 'Ferroviário'
            };
            return meios[meio] || meio;
        };

        // Traduzir natureza dos volumes
        const getNaturezaVolumesLabel = (natureza) => {
            const naturezas = {
                'CAIXAS': 'Caixas',
                'SACOS': 'Sacos',
                'PALETES': 'Paletes',
                'CONTAINERS': 'Containers',
                'TAMBORES': 'Tambores',
                'FARDOS': 'Fardos'
            };
            return naturezas[natureza] || natureza;
        };

        return {
            id: cert.id,
            numeroCertificado: `CERT-FITO-${String(cert.id).padStart(6, '0')}`,

            // Informações de Inspeção
            localDeInspecao: cert.localDeInspecao || 'N/A',
            funcionarioAutorizado: cert.nomeDoFuncionarioAutorizado || 'N/A',
            dataDeEmissao: dataEmissao.toISOString().split('T')[0],
            idadeCertificado: idadeCertificado,

            // Informações da Mercadoria
            naturezaDaMercadoria: cert.naturezaDaMercadoria || 'N/A',
            nomeBotanico: cert.nomeBotanico || 'N/A',
            origem: cert.origem || 'N/A',

            // Volumes
            quantidadeDeVolumes: cert.quantidadeDeVolumes || 0,
            naturezaDosVolumes: cert.naturezaDosVolumes || 'N/A',
            naturezaDosVolumesLabel: getNaturezaVolumesLabel(cert.naturezaDosVolumes),
            pesoDosVolumes: cert.pesoDosVolumes || 'N/A',
            marcasENumeros: cert.marcasENumeros || 'N/A',

            // Partes Envolvidas
            nomeDoExportador: cert.nomeDoExportador || 'N/A',
            enderecoDoExportador: cert.enderecoDoExportador || 'N/A',
            nomeDoDestinatario: cert.nomeDoDestinatario || 'N/A',
            enderecoDoDestinatario: cert.enderecoDoDestinatario || 'N/A',

            // Transporte
            pontoDeEntrada: cert.pontoDeEntrada || 'N/A',
            meioDeTransporte: cert.meioDeTransporte || 'N/A',
            meioDeTransporteLabel: getMeioTransporteLabel(cert.meioDeTransporte),
            portoDeEntrada: cert.portoDeEntrada || 'N/A',

            // Tratamento e Observações
            tratamentoAplicado: cert.tratamentoAplicado || 'Nenhum',
            observacoesAdicionais: cert.observacoesAdicionais || 'Nenhuma',

            // Valores e Confirmação
            valorDoSelo: cert.valorDoSelo || 0,
            confirmacaoDaDeclaracao: cert.confirmacaoDaDeclaracao || false,

            // Status
            statusCertificado: getStatusCertificado(dataEmissao, idadeCertificado)
        };
    });
};

const CertificadosFitossanitariosGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedMeioTransporte, setSelectedMeioTransporte] = useState('');
    const [selectedNaturezaVolumes, setSelectedNaturezaVolumes] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [certificados, setCertificados] = useState([]);
    const itemsPerPage = 5;
    const containerRef = useRef(null);

    const { certificadosData, loading, error } = useCertificadosFitossanitarios();

    console.log("Dados da API (certificados fitossanitários):", certificadosData);

    // Carregar e mapear certificados quando dados mudarem
    useEffect(() => {
        if (certificadosData && certificadosData.length > 0) {
            try {
                const certificadosMapeados = mapApiDataToCertificadoFitossanitario(certificadosData);
                setCertificados(certificadosMapeados);
                console.log("Certificados fitossanitários mapeados:", certificadosMapeados);
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
            showToast('success', 'Gerando PDF', 'Preparando o certificado fitossanitário...');

            // Importar a função existente do seu gerador
            const { gerarCertificadoFitossanitario } = await import('./CertificadoFitossanitarioDocument'); // ⚠️ Ajuste o caminho se necessário

            // ✅ Mapear dados da API para o formato esperado pelo PDF
            const formData = {
                // Campos principais
                localInspecao: cert.localDeInspecao || '',
                nomeFuncionarioAutorizado: cert.nomeDoFuncionarioAutorizado || '',
                dataEmissao: cert.dataDeEmissao || new Date().toISOString(),

                // Descrição da mercadoria
                naturezaMercadoria: cert.naturezaDaMercadoria || '',
                nomeBotanico: cert.nomeBotanico || '',
                origem: cert.origem || '',

                // Volumes
                quantidadeVolumes: cert.quantidadeDeVolumes || 0,
                naturezaVolumes: cert.naturezaDosVolumes || '',
                pesoVolumes: cert.pesoDosVolumes || '',
                marcasNumeros: cert.marcasENumeros || '',

                // Exportador e Destinatário
                nomeExportador: cert.nomeDoExportador || '',
                enderecoExportador: cert.enderecoDoExportador || '',
                nomeDestinatario: cert.nomeDoDestinatario || '',
                enderecoDestinatario: cert.enderecoDoDestinatario || '',

                // Transporte
                pontoEntrada: cert.pontoDeEntrada || '',
                meioTransporte: cert.meioDeTransporte || '',
                portoEntrada: cert.portoDeEntrada || '',

                // Tratamento e observações
                tratamentoAplicado: cert.tratamentoAplicado || 'THE FUMIGATION CONDITION OF 25ºC, 48H, 80G/m³ (CH₃Br)',
                observacoes: cert.observacoesAdicionais || '',
                valorSelo: cert.valorDoSelo || 20.00,

                // Declaração
                declaracaoDesinfeccao: cert.confirmacaoDaDeclaracao || true
            };

            console.log('📦 Dados preparados para PDF fitossanitário:', formData);

            // Gerar o PDF usando SUA função existente
            const resultado = await gerarCertificadoFitossanitario(formData);
            console.log('✅ Resultado:', resultado);

            showToast('success', 'Sucesso', 'Certificado fitossanitário gerado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao gerar certificado fitossanitário:', error);
            showToast('error', 'Erro', 'Erro ao gerar PDF: ' + error.message);
        }
    };

    // Função para mostrar toast
    const showToast = (type, title, message) => {
        setToastMessage({ type, title, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Ícone do meio de transporte
    const getTransportIcon = (meio) => {
        const icons = {
            'MARITIMO': <Ship className="w-5 h-5" />,
            'AEREO': <Plane className="w-5 h-5" />,
            'TERRESTRE': <Truck className="w-5 h-5" />,
            'FERROVIARIO': <Train className="w-5 h-5" />
        };
        return icons[meio] || <Truck className="w-5 h-5" />;
    };

    // Avatar do certificado
    const CertificadoAvatar = ({ certificado, size = "w-20 h-20", textSize = "text-lg" }) => {
        const getInitials = (nome) => {
            if (!nome || nome === 'N/A') return 'CF';
            return nome.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        };

        return (
            <div className={`${size} rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {getInitials(certificado?.nomeDoExportador)}
            </div>
        );
    };

    // Filtragem dos certificados
    const filteredCertificados = useMemo(() => {
        return certificados.filter(certificado => {
            const matchesSearch =
                certificado.numeroCertificado.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.nomeDoExportador.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.nomeDoDestinatario.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.naturezaDaMercadoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.nomeBotanico.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.origem.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !selectedStatus || certificado.statusCertificado === selectedStatus;
            const matchesMeioTransporte = !selectedMeioTransporte || certificado.meioDeTransporte === selectedMeioTransporte;
            const matchesNaturezaVolumes = !selectedNaturezaVolumes || certificado.naturezaDosVolumes === selectedNaturezaVolumes;

            return matchesSearch && matchesStatus && matchesMeioTransporte && matchesNaturezaVolumes;
        });
    }, [certificados, searchTerm, selectedStatus, selectedMeioTransporte, selectedNaturezaVolumes]);

    // Estatísticas
    const estatisticas = useMemo(() => {
        const totalVolumes = certificados.reduce((sum, c) => sum + (c.quantidadeDeVolumes || 0), 0);
        const totalValorSelos = certificados.reduce((sum, c) => sum + (c.valorDoSelo || 0), 0);

        return {
            total: certificados.length,
            activos: certificados.filter(c => c.statusCertificado === 'ACTIVO').length,
            proximoVenc: certificados.filter(c => c.statusCertificado === 'PROXIMO_CADUCIDADE').length,
            expirados: certificados.filter(c => c.statusCertificado === 'EXPIRADO').length,
            totalVolumes: totalVolumes,
            totalValorSelos: totalValorSelos
        };
    }, [certificados]);

    // Reset página quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedMeioTransporte, selectedNaturezaVolumes]);

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

    // Calcular dias desde emissão
    const getDaysSinceIssue = (dataEmissao) => {
        if (!dataEmissao) return null;
        try {
            const hoje = new Date();
            const emissao = new Date(dataEmissao);
            const diffTime = hoje - emissao;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch {
            return null;
        }
    };

    // Exportar dados
    const handleExportData = () => {
        try {
            const dataToExport = filteredCertificados.map(cert => ({
                'Número do Certificado': cert.numeroCertificado,
                'Data de Emissão': formatDate(cert.dataDeEmissao),
                'Local de Inspeção': cert.localDeInspecao,
                'Funcionário Autorizado': cert.funcionarioAutorizado,
                'Exportador': cert.nomeDoExportador,
                'Endereço Exportador': cert.enderecoDoExportador,
                'Destinatário': cert.nomeDoDestinatario,
                'Endereço Destinatário': cert.enderecoDoDestinatario,
                'Natureza da Mercadoria': cert.naturezaDaMercadoria,
                'Nome Botânico': cert.nomeBotanico,
                'Origem': cert.origem,
                'Quantidade de Volumes': cert.quantidadeDeVolumes,
                'Natureza dos Volumes': cert.naturezaDosVolumesLabel,
                'Peso dos Volumes': cert.pesoDosVolumes,
                'Meio de Transporte': cert.meioDeTransporteLabel,
                'Porto de Entrada': cert.portoDeEntrada,
                'Ponto de Entrada': cert.pontoDeEntrada,
                'Tratamento Aplicado': cert.tratamentoAplicado,
                'Valor do Selo': cert.valorDoSelo,
                'Estado': getStatusLabel(cert.statusCertificado),
                'Confirmação': cert.confirmacaoDaDeclaracao ? 'Sim' : 'Não'
            }));

            const csv = [
                Object.keys(dataToExport[0]).join(','),
                ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `certificados_fitossanitarios_${new Date().toISOString().split('T')[0]}.csv`);
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

    // Cores para estados
    const getStatusColor = (status) => {
        const colors = {
            'ACTIVO': 'bg-green-100 text-green-800 border-green-300',
            'EXPIRADO': 'bg-red-100 text-red-800 border-red-300',
            'PROXIMO_CADUCIDADE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'AGUARDANDO_VIGENCIA': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Labels para estados
    const getStatusLabel = (status) => {
        const labels = {
            'ACTIVO': 'Activo',
            'EXPIRADO': 'Expirado',
            'PROXIMO_CADUCIDADE': 'Próximo ao Vencimento',
            'AGUARDANDO_VIGENCIA': 'Aguardando Vigência'
        };
        return labels[status] || status;
    };

    // Opções para filtros
    const meiosTransporteUnicos = [...new Set(
        certificados.map(c => c.meioDeTransporte)
    )].filter(Boolean);

    const naturezasVolumesUnicas = [...new Set(
        certificados.map(c => c.naturezaDosVolumes)
    )].filter(Boolean);

    return (
        <div>
            <Toast />

            {/* Estatísticas */}
            {!loading && certificados.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Activos</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.activos}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Próx. Venc.</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.proximoVenc}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <X className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Expirados</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.expirados}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Package className="w-6 h-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Volumes</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalVolumes}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Valor Selos</p>
                                <p className="text-xl font-bold text-gray-900">{estatisticas.totalValorSelos.toLocaleString()} AKZ</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Certificados Fitossanitários</h1>
                            <p className="text-blue-100 mt-1">Controle e monitoramento de certificações fitossanitárias</p>
                        </div>
                        <button
                            onClick={handleExportData}
                            disabled={certificados.length === 0}
                            className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                                placeholder="Pesquisar por exportador, mercadoria..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Estado do Certificado"
                                value={selectedStatus ? { label: getStatusLabel(selectedStatus), value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos os Estados', value: '' },
                                    { label: 'Activo', value: 'ACTIVO' },
                                    { label: 'Próximo ao Vencimento', value: 'PROXIMO_CADUCIDADE' },
                                    { label: 'Expirado', value: 'EXPIRADO' },
                                    { label: 'Aguardando Vigência', value: 'AGUARDANDO_VIGENCIA' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Filter size={18} />}
                            />
                        </div>

                        {/* Filtro Meio de Transporte */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Meio de Transporte"
                                value={selectedMeioTransporte ? {
                                    label: certificados.find(c => c.meioDeTransporte === selectedMeioTransporte)?.meioDeTransporteLabel || selectedMeioTransporte,
                                    value: selectedMeioTransporte
                                } : null}
                                options={[
                                    { label: 'Todos os Meios', value: '' },
                                    ...meiosTransporteUnicos.map(meio => ({
                                        label: certificados.find(c => c.meioDeTransporte === meio)?.meioDeTransporteLabel || meio,
                                        value: meio
                                    }))
                                ]}
                                onChange={(option) => setSelectedMeioTransporte(option?.value || '')}
                                iconStart={<Truck size={18} />}
                            />
                        </div>

                        {/* Filtro Natureza dos Volumes */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Natureza dos Volumes"
                                value={selectedNaturezaVolumes ? {
                                    label: certificados.find(c => c.naturezaDosVolumes === selectedNaturezaVolumes)?.naturezaDosVolumesLabel || selectedNaturezaVolumes,
                                    value: selectedNaturezaVolumes
                                } : null}
                                options={[
                                    { label: 'Todas as Naturezas', value: '' },
                                    ...naturezasVolumesUnicas.map(natureza => ({
                                        label: certificados.find(c => c.naturezaDosVolumes === natureza)?.naturezaDosVolumesLabel || natureza,
                                        value: natureza
                                    }))
                                ]}
                                onChange={(option) => setSelectedNaturezaVolumes(option?.value || '')}
                                iconStart={<Package size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                            <span className="ml-3 text-gray-600">Carregando certificados...</span>
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Certificado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Exportador</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Mercadoria</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Volumes</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Transporte</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Emissão</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Acção</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-start bg-white">
                                {getCurrentItems().map((cert) => (
                                    <tr key={cert.id} className="hover:bg-blue-50 transition-colors text-s">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <CertificadoAvatar certificado={cert} size="w-16 h-16" textSize="text-lg" />
                                                <div className="ml-3">
                                                    <div className="text-sm font-semibold text-gray-900">{cert.numeroCertificado}</div>
                                                    <div className="text-xs text-gray-600">{cert.funcionarioAutorizado}</div>
                                                    <div className="text-xs text-gray-500">{cert.localDeInspecao}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{cert.nomeDoExportador}</div>
                                            <div className="text-xs text-gray-600 mt-1">{cert.enderecoDoExportador}</div>
                                            <div className="text-xs text-gray-500 mt-1">→ {cert.nomeDoDestinatario}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-700">{cert.naturezaDaMercadoria}</div>
                                            <div className="text-xs text-gray-600 mt-1 italic">{cert.nomeBotanico}</div>
                                            <div className="text-xs text-gray-500">Origem: {cert.origem}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-700">Qtd: {cert.quantidadeDeVolumes}</div>
                                            <div className="text-xs text-gray-600">{cert.naturezaDosVolumesLabel}</div>
                                            <div className="text-xs text-gray-500">Peso: {cert.pesoDosVolumes}</div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {getTransportIcon(cert.meioDeTransporte)}
                                                <div>
                                                    <div className="text-xs text-gray-700">{cert.meioDeTransporteLabel}</div>
                                                    <div className="text-xs text-gray-600">{cert.portoDeEntrada}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <div className="text-xs text-gray-700">{formatDate(cert.dataDeEmissao)}</div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {cert.idadeCertificado} {cert.idadeCertificado === 1 ? 'dia' : 'dias'}
                                            </div>
                                            <div className="text-xs text-gray-600">Selo: {cert.valorDoSelo} AKZ</div>
                                        </td>

                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(cert.statusCertificado)}`}>
                                                {getStatusLabel(cert.statusCertificado)}
                                            </span>
                                            {cert.confirmacaoDaDeclaracao && (
                                                <div className="text-xs text-green-600 font-medium mt-1">
                                                    <CheckCircle className="w-3 h-3 inline mr-1" />
                                                    Confirmado
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleViewCertificado(cert)}
                                                    className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                    title="Ver detalhes do certificado fitossanitário"
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
                                        'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
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
                        <Package className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {certificados.length === 0 ? 'Nenhum certificado encontrado' : 'Nenhum resultado encontrado'}
                        </h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            {certificados.length === 0
                                ? 'Ainda não existem certificados fitossanitários registados no sistema.'
                                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros.'}
                        </p>
                        {(searchTerm || selectedStatus || selectedMeioTransporte || selectedNaturezaVolumes) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedStatus('');
                                    setSelectedMeioTransporte('');
                                    setSelectedNaturezaVolumes('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default CertificadosFitossanitariosGestao;