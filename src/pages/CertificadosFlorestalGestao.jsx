import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    Eye,
    AlertCircle,
    CheckCircle,
    X,
    MapPin,
    Calendar,
    Info,
    User,
    Award,
    Clock,
    Activity,
    AlertTriangle,
    FileText,
    Globe,
    Trees,
    Phone,
    CreditCard,
    Mountain,
    Leaf
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import axios from 'axios';

// Hook personalizado para buscar produtores florestais com certificados
const useCertificadosFlorestais = () => {
    const [produtoresFlorestais, setProdutoresFlorestais] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProdutoresFlorestais = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await axios.get(
                    'https://mwangobrainsa-001-site2.mtempurl.com/api/certificaoDoProdutorFlorestal/produtoresFlorestaisComCertificados',
                    { timeout: 10000 }
                );
                
                if (response.data && Array.isArray(response.data)) {
                    setProdutoresFlorestais(response.data);
                } else {
                    setProdutoresFlorestais([]);
                }
            } catch (error) {
                console.error('Erro ao buscar produtores florestais:', error);
                setError('Erro ao carregar dados dos certificados florestais');
                setProdutoresFlorestais([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProdutoresFlorestais();
    }, []);

    return { produtoresFlorestais, loading, error };
};

// Função para mapear os dados da API florestal para o formato de certificado
const mapApiDataToCertificadoFlorestal = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((produtor) => {
        // Extrair coordenadas GPS
        const getCoordinates = (coordenadas) => {
            if (!coordenadas) return { lat: 0, lng: 0 };
            const coords = coordenadas.split(' ').map(c => c.trim());
            return {
                lat: parseFloat(coords[0]) || 0,
                lng: parseFloat(coords[1]) || 0
            };
        };

        // Simular datas do certificado baseado no produtor
        const hoje = new Date();
        const validadeInicio = new Date(produtor.validade_pretendida || hoje);
        const validadeFim = new Date(validadeInicio);
        validadeFim.setFullYear(validadeFim.getFullYear() + 3); // Certificado válido por 3 anos

        // Calcular status do certificado
        const getStatusCertificado = (validoDe, validoAte, status) => {
            if (status === 'Pendente') return 'PENDENTE';
            if (produtor.autoriza_o_final === 'aprovada' && hoje < validoDe) return 'AGUARDANDO_VIGENCIA';
            if (hoje > validoAte) return 'EXPIRADO';

            const diasParaVencer = Math.ceil((validoAte - hoje) / (1000 * 60 * 60 * 24));
            if (diasParaVencer <= 90 && diasParaVencer > 0) return 'PROXIMO_CADUCIDADE';

            return produtor.autoriza_o_final === 'aprovada' ? 'ACTIVO' : 'PENDENTE';
        };

        // Determinar tipo de licença
        const tipoLicenca = produtor.tipo_de_licen_a_solicitada || 'Não especificado';
        
        const coordenadas = getCoordinates(produtor.localiza_o_GPS);

        return {
            id: produtor._id?.toString(),
            produtorId: produtor._id,
            numeroProcesso: `CERT-FL-${produtor._id}`,
            numeroLicenca: produtor.iD_da_licen_a_fiscalizada || 'N/A',
            tipoLicencaSolicitada: tipoLicenca.charAt(0).toUpperCase() + tipoLicenca.slice(1),
            areaAssociada: parseFloat(produtor._rea_associada) || 0,
            volumeEstimado: parseFloat(produtor.volume_estimado_m) || 0,
            volumeAnual: parseFloat(produtor.volume_anual_m) || 0,
            especiesPredominantes: produtor.esp_cies_predominantes || 'Não informado',
            especieProduzida: produtor.esp_cie_produzida || 'Não informado',
            estadoConservacao: produtor.estado_de_conserva_o || 'Não informado',
            propriedade: produtor.propriedade || 'Não informado',
            validoDe: validadeInicio.toISOString().split('T')[0],
            validoAte: validadeFim.toISOString().split('T')[0],
            statusCertificado: getStatusCertificado(validadeInicio, validadeFim, produtor.estado),
            autorizacaoFinal: produtor.autoriza_o_final || 'pendente',
            dataInspecao: produtor.data_da_inspe_o ? new Date(produtor.data_da_inspe_o).toISOString().split('T')[0] : null,
            resultadoInspecao: produtor.resultado_da_inspe_o || 'Não realizada',
            coordenadasGPS: coordenadas,
            latitude: coordenadas.lat.toString(),
            longitude: coordenadas.lng.toString(),
            // Dados do produtor florestal
            produtor: {
                nome: produtor.nome_do_Produtor || 'Nome não informado',
                genero: produtor.g_nero || 'N/A',
                bi: produtor.bI_NIF || 'N/A',
                telefone: produtor.contacto || 'N/A',
                email: produtor.e_mail || 'N/A',
                dataNascimento: produtor.data_de_Nascimento ? 
                    new Date(produtor.data_de_Nascimento).toISOString().split('T')[0] : 'N/A',
                provincia: produtor.provincia || 'N/A',
                municipio: produtor.municipio || 'N/A',
                comuna: produtor.comuna || 'N/A',
                estado: produtor.estado || 'Pendente',
                modoSubmissao: produtor.modo_de_submiss_o || 'N/A',
                valorAKZ: produtor.valor_AKZ ? parseFloat(produtor.valor_AKZ) : 0,
                statusSancao: produtor.status_da_san_o || 'N/A'
            }
        };
    });
};

const CertificadosFlorestalGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTipoLicenca, setSelectedTipoLicenca] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [certificados, setCertificados] = useState([]);
    const itemsPerPage = 5;
    const containerRef = useRef(null);
    
    const { produtoresFlorestais, loading, error } = useCertificadosFlorestais();

    console.log("Dados da API (produtores florestais com certificados):", produtoresFlorestais);

    // Carregar e mapear certificados quando dados mudarem
    useEffect(() => {
        if (produtoresFlorestais && produtoresFlorestais.length > 0) {
            try {
                const certificadosMapeados = mapApiDataToCertificadoFlorestal(produtoresFlorestais);
                setCertificados(certificadosMapeados);
                console.log("Certificados florestais mapeados:", certificadosMapeados);
            } catch (error) {
                console.error('Erro ao mapear certificados florestais:', error);
                showToast('error', 'Erro', 'Erro ao processar dados dos certificados florestais');
            }
        } else {
            setCertificados([]);
        }
    }, [produtoresFlorestais]);

    // Ajustar altura do conteúdo
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const headerHeight = 240;
                const windowHeight = window.innerHeight;
                const availableHeight = windowHeight - headerHeight;
                setContentHeight(`${availableHeight}px`);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Limpar timeout
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Função para mostrar toast
    const showToast = (type, title, message, duration = 5000) => {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        setToastMessage({ type, title, message });

        const timeout = setTimeout(() => {
            setToastMessage(null);
        }, duration);

        setToastTimeout(timeout);
    };

    // Navegação para visualizar certificados do produtor florestal
    const handleViewCertificado = (produtorId) => {
        navigate(`/GerenciaRNPA/certificados-florestais/visualizar/${produtorId}`);
    };

    const ProdutorAvatar = ({
        produtor,
        size = "w-20 h-20",
        textSize = "text-lg",
        showLoadingSpinner = true
    }) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [imageLoading, setImageLoading] = useState(true);
        const [imageError, setImageError] = useState(false);

        // Gerar iniciais do nome como fallback
        const getInitials = (nome) => {
            if (!nome) return 'PF';
            return nome.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        };

        useEffect(() => {
            const fetchProdutorPhoto = async () => {
                if (!produtor?.id) {
                    setImageLoading(false);
                    setImageError(true);
                    return;
                }

                try {
                    setImageLoading(true);
                    setImageError(false);

                    const response = await axios.get(
                        `https://mwangobrainsa-001-site2.mtempurl.com/api/produtorFlorestal/${produtor.id}/foto`,
                        {
                            responseType: 'blob',
                            timeout: 10000,
                            headers: {
                                'Accept': 'image/*'
                            }
                        }
                    );

                    if (response.data && response.data.size > 0) {
                        const url = URL.createObjectURL(response.data);
                        setImageUrl(url);
                        setImageError(false);
                    } else {
                        setImageError(true);
                    }

                } catch (error) {
                    console.error('Erro ao carregar foto do produtor florestal:', error);
                    setImageError(true);
                } finally {
                    setImageLoading(false);
                }
            };

            fetchProdutorPhoto();

            return () => {
                if (imageUrl) {
                    URL.revokeObjectURL(imageUrl);
                }
            };
        }, [produtor?.id]);

        if (imageLoading && showLoadingSpinner) {
            return (
                <div className={`${size} rounded-full bg-green-200 flex items-center justify-center shadow-sm animate-pulse`}>
                    <Trees className="w-6 h-6 text-green-400" />
                </div>
            );
        }

        if (imageUrl && !imageError) {
            return (
                <div className={`${size} rounded-full overflow-hidden shadow-sm border-2 border-white`}>
                    <img
                        src={imageUrl}
                        alt={`Foto de ${produtor.nome}`}
                        className="w-full h-full object-cover"
                        onError={() => {
                            setImageError(true);
                            if (imageUrl) {
                                URL.revokeObjectURL(imageUrl);
                            }
                            setImageUrl(null);
                        }}
                    />
                </div>
            );
        }

        return (
            <div className={`${size} rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {getInitials(produtor?.nome)}
            </div>
        );
    };

    // Filtragem dos certificados
    const filteredCertificados = useMemo(() => {
        return certificados.filter(certificado => {
            const matchesSearch =
                certificado.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.numeroLicenca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.tipoLicencaSolicitada.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.bi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.especiesPredominantes.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !selectedStatus || certificado.statusCertificado === selectedStatus;
            const matchesLicenca = !selectedTipoLicenca || certificado.tipoLicencaSolicitada === selectedTipoLicenca;

            return matchesSearch && matchesStatus && matchesLicenca;
        });
    }, [certificados, searchTerm, selectedStatus, selectedTipoLicenca]);

    // Reset página quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedTipoLicenca]);

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

    // Calcular dias restantes para vencimento
    const getDaysToExpiry = (validoAte) => {
        if (!validoAte) return null;
        try {
            const hoje = new Date();
            const dataFim = new Date(validoAte);
            const diffTime = dataFim - hoje;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays;
        } catch {
            return null;
        }
    };

    // Exportar dados dos certificados florestais
    const handleExportData = () => {
        try {
            const dataToExport = filteredCertificados.map(cert => ({
                'Número do Processo': cert.numeroProcesso,
                'ID da Licença': cert.numeroLicenca,
                'Nome do Produtor': cert.produtor.nome,
                'BI/NIF': cert.produtor.bi,
                'Telefone': cert.produtor.telefone,
                'Tipo de Licença': cert.tipoLicencaSolicitada,
                'Área Associada (ha)': cert.areaAssociada,
                'Volume Estimado (m³)': cert.volumeEstimado,
                'Volume Anual (m³)': cert.volumeAnual,
                'Espécies Predominantes': cert.especiesPredominantes,
                'Estado de Conservação': cert.estadoConservacao,
                'Propriedade': cert.propriedade,
                'Válido De': formatDate(cert.validoDe),
                'Válido Até': formatDate(cert.validoAte),
                'Estado': getStatusLabel(cert.statusCertificado),
                'Autorização Final': cert.autorizacaoFinal,
                'Data da Inspeção': formatDate(cert.dataInspecao),
                'Resultado da Inspeção': cert.resultadoInspecao
            }));

            const csv = [
                Object.keys(dataToExport[0]).join(','),
                ...dataToExport.map(row => Object.values(row).map(val => `"${val}"`).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `certificados_florestais_${new Date().toISOString().split('T')[0]}.csv`);
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

    // Componente Toast
    const Toast = () => {
        if (!toastMessage) return null;

        const { type, title, message } = toastMessage;

        let bgColor, icon;
        switch (type) {
            case 'success':
                bgColor = 'bg-green-50 border-l-4 border-green-500 text-green-700';
                icon = <CheckCircle className="w-5 h-5" />;
                break;
            case 'error':
                bgColor = 'bg-red-50 border-l-4 border-red-500 text-red-700';
                icon = <AlertCircle className="w-5 h-5" />;
                break;
            case 'info':
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
                icon = <AlertCircle className="w-5 h-5" />;
                break;
            default:
                bgColor = 'bg-gray-50 border-l-4 border-gray-500 text-gray-700';
                icon = <AlertCircle className="w-5 h-5" />;
        }

        return (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor} animate-fadeIn`}>
                <div className="flex items-center">
                    <div className="mr-3">{icon}</div>
                    <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                    <button
                        className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={() => setToastMessage(null)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    // Cores para diferentes estados
    const getStatusColor = (status) => {
        const statusColors = {
            'ACTIVO': 'bg-green-100 text-green-800 border-green-300',
            'EXPIRADO': 'bg-red-100 text-red-800 border-red-300',
            'PROXIMO_CADUCIDADE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'AGUARDANDO_VIGENCIA': 'bg-blue-100 text-blue-800 border-blue-300',
            'PENDENTE': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Labels para estados
    const getStatusLabel = (status) => {
        const statusLabels = {
            'ACTIVO': 'Activo',
            'EXPIRADO': 'Expirado',
            'PROXIMO_CADUCIDADE': 'Próximo ao Vencimento',
            'AGUARDANDO_VIGENCIA': 'Aguardando Vigência',
            'PENDENTE': 'Pendente'
        };
        return statusLabels[status] || status;
    };

    // Opções para filtros
    const tiposLicencaUnicos = [...new Set(certificados.map(c => c.tipoLicencaSolicitada))].filter(Boolean);

    return (
        <div>
            {/* Estatísticas dos certificados florestais */}
            {!loading && certificados.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Trees className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{certificados.length}</p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {certificados.filter(c => c.statusCertificado === 'ACTIVO').length}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {certificados.filter(c => c.statusCertificado === 'PROXIMO_CADUCIDADE').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <Clock className="w-6 h-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {certificados.filter(c => c.statusCertificado === 'PENDENTE').length}
                                </p>
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
                                <p className="text-2xl font-bold text-gray-900">
                                    {certificados.filter(c => c.statusCertificado === 'EXPIRADO').length}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen" ref={containerRef}>
                <Toast />

                <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="bg-gradient-to-r from-green-700 to-green-500 p-6 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                <h1 className="text-2xl font-bold">Gestão de Certificados Florestais</h1>
                                <p className="text-green-100 mt-1">Produtores florestais com licenças e certificados</p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleExportData}
                                    disabled={certificados.length === 0}
                                    className="inline-flex items-center px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Exportar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Barra de ferramentas */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Busca */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="text"
                                    placeholder="Pesquisar por nome, BI, processo, licença, espécies..."
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
                                        { label: 'Pendente', value: 'PENDENTE' },
                                        { label: 'Próximo ao Vencimento', value: 'PROXIMO_CADUCIDADE' },
                                        { label: 'Expirado', value: 'EXPIRADO' },
                                        { label: 'Aguardando Vigência', value: 'AGUARDANDO_VIGENCIA' }
                                    ]}
                                    onChange={(option) => setSelectedStatus(option?.value || '')}
                                    iconStart={<Filter size={18} />}
                                />
                            </div>

                            {/* Filtro Tipo de Licença */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Tipo de Licença"
                                    value={selectedTipoLicenca ? { label: selectedTipoLicenca, value: selectedTipoLicenca } : null}
                                    options={[
                                        { label: 'Todos os Tipos', value: '' },
                                        ...tiposLicencaUnicos.map(tipo => ({
                                            label: tipo,
                                            value: tipo
                                        }))
                                    ]}
                                    onChange={(option) => setSelectedTipoLicenca(option?.value || '')}
                                    iconStart={<Trees size={18} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabela - Desktop */}
                    <div className="hidden md:block">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                <span className="ml-3 text-gray-600">Carregando certificados florestais...</span>
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Produtor Florestal
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Licença/Certificado
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Área e Volume
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Estado
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Acções
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {getCurrentItems().map((certificado) => (
                                        <tr key={certificado.id} className="hover:bg-green-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap max-w-[290px]">
                                                <div className="flex items-center">
                                                    <ProdutorAvatar
                                                        produtor={{
                                                            id: certificado.produtorId,
                                                            nome: certificado.produtor.nome
                                                        }}
                                                        size="w-20 h-20"
                                                        textSize="text-lg"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line max-w-[290px]">
                                                            {certificado.produtor.nome}
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-600 mt-1">
                                                            <CreditCard className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                            BI/NIF: {certificado.produtor.bi}
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Phone className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                            {certificado.produtor.telefone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm font-medium text-gray-900">
                                                        <Award className="w-4 h-4 mr-2 text-green-500" />
                                                        {certificado.numeroProcesso}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Licença: {certificado.numeroLicenca}
                                                    </div>
                                                    <div className="text-xs text-gray-600">
                                                        Tipo: {certificado.tipoLicencaSolicitada}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-700">
                                                        <Calendar className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                        {formatDate(certificado.validoDe)} - {formatDate(certificado.validoAte)}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-xs text-gray-700">
                                                        <Mountain className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                        Área: {certificado.areaAssociada} ha
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-700">
                                                        <Trees className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                        Vol. Est.: {certificado.volumeEstimado} m³
                                                    </div>
                                                    {certificado.volumeAnual > 0 && (
                                                        <div className="text-xs text-gray-600">
                                                            Vol. Anual: {certificado.volumeAnual} m³
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center">
                                                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(certificado.statusCertificado)}`}>
                                                        {getStatusLabel(certificado.statusCertificado)}
                                                    </span>
                                                </div>
                                                {certificado.statusCertificado === 'PROXIMO_CADUCIDADE' && (
                                                    <div className="text-xs text-yellow-600 font-medium text-center mt-1">
                                                        {getDaysToExpiry(certificado.validoAte)} dias
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button
                                                        onClick={() => handleViewCertificado(certificado.produtorId)}
                                                        className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                        title="Ver detalhes do certificado florestal"
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

                    {/* Visualização em cards para mobile */}
                    <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                <span className="ml-3 text-gray-600">Carregando...</span>
                            </div>
                        ) : (
                            getCurrentItems().map((certificado) => (
                                <div key={certificado.id} className="p-4 border-b border-gray-200 hover:bg-green-50 transition-colors">
                                    <div className="flex items-start">
                                        <ProdutorAvatar
                                            produtor={{
                                                id: certificado.produtorId,
                                                nome: certificado.produtor.nome
                                            }}
                                            size="w-16 h-16"
                                            textSize="text-sm"
                                        />
                                        <div className="flex-1 ml-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{certificado.produtor.nome}</h3>
                                                    <div className="text-xs text-gray-500 mt-1">BI/NIF: {certificado.produtor.bi}</div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(certificado.statusCertificado)}`}>
                                                    {getStatusLabel(certificado.statusCertificado)}
                                                </span>
                                            </div>

                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Award className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                    {certificado.numeroProcesso}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Trees className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                    {certificado.tipoLicencaSolicitada}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Mountain className="w-3.5 h-3.5 mr-1 text-green-500" />
                                                    {certificado.areaAssociada} ha | {certificado.volumeEstimado} m³
                                                </div>
                                                <div className="text-xs text-gray-600 line-clamp-2">
                                                    Espécies: {certificado.especiesPredominantes}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleViewCertificado(certificado.produtorId)}
                                                        className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                        title="Ver certificado"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Paginação */}
                    {!loading && filteredCertificados.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-white">
                            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                <div className="text-sm text-gray-700">
                                    Mostrando{' '}
                                    <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                                    {' '}a{' '}
                                    <span className="font-medium">
                                        {Math.min(currentPage * itemsPerPage, filteredCertificados.length)}
                                    </span>
                                    {' '}de{' '}
                                    <span className="font-medium">{filteredCertificados.length}</span>
                                    {' '}resultados
                                </div>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                            ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
                                            }
                                        `}
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Anterior
                                    </button>

                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages || totalPages === 0}
                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                            ${currentPage === totalPages || totalPages === 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
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

                    {/* Nenhum resultado encontrado */}
                    {!loading && filteredCertificados.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <Trees className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {certificados.length === 0 ? 'Nenhum certificado florestal encontrado' : 'Nenhum certificado encontrado'}
                            </h3>
                            <p className="text-gray-500 max-w-md mb-6">
                                {certificados.length === 0
                                    ? 'Ainda não existem certificados florestais registados no sistema.'
                                    : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros aplicados.'
                                }
                            </p>
                            {(searchTerm || selectedStatus || selectedTipoLicenca) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedStatus('');
                                        setSelectedTipoLicenca('');
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CertificadosFlorestalGestao;