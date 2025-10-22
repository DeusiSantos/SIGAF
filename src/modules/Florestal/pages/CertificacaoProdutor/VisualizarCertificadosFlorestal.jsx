import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Award,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Download,
    FileText,
    IdCard,
    Info,
    MapPin,
    Phone,
    User,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import axios from 'axios';
import api from '../../../../core/services/api';

const VisualizarCertificadosFlorestal = () => {
    const { tipo, produtorId: id } = useParams();
    const navigate = useNavigate();

    const [entidade, setEntidade] = useState(null); // Produtor ou Organização
    const [certificados, setCertificados] = useState([]);
    const [selectedCertificados, setSelectedCertificados] = useState([]);
    const [loadingEntidade, setLoadingEntidade] = useState(true);
    const [loadingCertificados, setLoadingCertificados] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [gerandoCertificado, setGerandoCertificado] = useState(null);

    console.log('🔍 VISUALIZAR CERTIFICADOS - tipo:', tipo, 'id:', id);

    // Validar tipo
    const isProdutor = tipo === 'produtor';
    const isOrganizacao = tipo === 'organizacao';

    if (!isProdutor && !isOrganizacao) {
        console.error('❌ Tipo inválido:', tipo);
    }

    const EntidadeAvatar = ({
        entidade,
        tipo,
        size = "w-20 h-20",
        textSize = "text-lg",
        showLoadingSpinner = true
    }) => {
        const [imageUrl, setImageUrl] = useState(null);
        const [imageLoading, setImageLoading] = useState(true);
        const [imageError, setImageError] = useState(false);

        const getInitials = (nome) => {
            if (!nome) return tipo === 'organizacao' ? 'ORG' : 'P';
            return nome.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        };

        useEffect(() => {
            const fetchPhoto = async () => {
                if (!entidade?.id || tipo === 'organizacao') {
                    setImageLoading(false);
                    setImageError(true);
                    return;
                }

                try {
                    setImageLoading(true);
                    setImageError(false);

                    const response = await axios.get(
                        `https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/${entidade.id}/foto-beneficiary`,
                        {
                            responseType: 'blob',
                            timeout: 10000,
                            headers: { 'Accept': 'image/*' }
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
                    console.error('Erro ao carregar foto:', error);
                    setImageError(true);
                } finally {
                    setImageLoading(false);
                }
            };

            fetchPhoto();

            return () => {
                if (imageUrl) {
                    URL.revokeObjectURL(imageUrl);
                }
            };
        }, [entidade?.id, tipo]);

        if (imageLoading && showLoadingSpinner && tipo !== 'organizacao') {
            return (
                <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center shadow-sm animate-pulse`}>
                    <User className="w-6 h-6 text-gray-400" />
                </div>
            );
        }

        if (imageUrl && !imageError && tipo === 'produtor') {
            return (
                <div className={`${size} rounded-full overflow-hidden shadow-sm border-2 border-white`}>
                    <img
                        src={imageUrl}
                        alt={`Foto de ${entidade.nome}`}
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

        const gradientColor = tipo === 'organizacao'
            ? 'from-purple-400 to-purple-600'
            : 'from-blue-400 to-blue-600';

        return (
            <div className={`${size} rounded-full bg-gradient-to-r ${gradientColor} flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {tipo === 'organizacao' ? (
                    <Building2 className="w-8 h-8" />
                ) : (
                    getInitials(entidade?.nome_do_Produtor || entidade?.nomeCompleto)
                )}
            </div>
        );
    };

    // Buscar dados da entidade (Produtor ou Organização)
    useEffect(() => {
        const fetchEntidade = async () => {
            if (!id || (!isProdutor && !isOrganizacao)) {
                setLoadingEntidade(false);
                return;
            }

            try {
                console.log(`🔍 Buscando ${tipo}:`, id);
                setLoadingEntidade(true);

                let response;
                if (isProdutor) {
                    response = await api.get(`/produtorFlorestal/${id}`);
                } else {
                    response = await api.get(`/organizacao/${id}`);
                }

                console.log(`✅ Dados do ${tipo}:`, response.data);
                setEntidade(response.data);
            } catch (error) {
                console.error(`❌ Erro ao buscar ${tipo}:`, error);
                showToast('error', 'Erro', `Erro ao carregar dados do ${tipo}`);
            } finally {
                setLoadingEntidade(false);
            }
        };

        fetchEntidade();
    }, [id, tipo, isProdutor, isOrganizacao]);

    // Buscar certificados
    useEffect(() => {
        const fetchCertificados = async () => {
            if (!id || (!isProdutor && !isOrganizacao)) {
                setLoadingCertificados(false);
                return;
            }

            try {
                console.log(`🔍 Buscando certificados do ${tipo}:`, id);
                setLoadingCertificados(true);

                let endpoint;
                if (isProdutor) {
                    endpoint = `/certificaoDoProdutorFlorestal/produtoresFlorestais/${id}`;
                } else {
                    endpoint = `/certificaoDoProdutorFlorestal/organizacao/${id}`;
                }

                const response = await api.get(endpoint);
                console.log('✅ Certificados da API:', response.data);

                const certificadosMapeados = Array.isArray(response.data)
                    ? response.data.map(certificado => {
                        const getStatusCertificado = (validoDe, validoAte) => {
                            const hoje = new Date();
                            const dataInicio = validoDe ? new Date(validoDe) : null;
                            const dataFim = validoAte ? new Date(validoAte) : null;

                            if (!dataInicio || !dataFim) return 'DATA_INVALIDA';
                            if (hoje < dataInicio) return 'AGUARDANDO_VIGENCIA';
                            if (hoje > dataFim) return 'EXPIRADO';

                            const diasParaVencer = Math.ceil((dataFim - hoje) / (1000 * 60 * 60 * 24));
                            if (diasParaVencer <= 30 && diasParaVencer > 0) return 'PROXIMO_VENCIMENTO';

                            return 'ATIVO';
                        };

                        let finalidadeCertificado = [];
                        const valor = certificado.finalidadeDoCertificado;

                        if (Array.isArray(valor)) {
                            finalidadeCertificado = valor;
                        } else if (typeof valor === 'string' && valor.trim() !== '') {
                            finalidadeCertificado = valor
                                .split('-')
                                .map(f => f.trim().replace(/-/g, ' '))
                                .filter(Boolean);
                        }

                        return {
                            id: certificado.id ? String(certificado.id) : null,
                            numeroProcesso: certificado.numeroDoProcesso || `PROC-${certificado.id || 'N/A'}`,
                            nomeDaPropriedade: certificado.nomeDaPropriedade || 'Propriedade sem nome',
                            atividadePrincipal: certificado.atividadePrincipal || 'Não informado',
                            areaTotalExplorada: parseFloat(certificado.areaTotalExplorada) || 0,
                            tecnicoResponsavel: certificado.nomeDoTecnicoResponsavel || 'Não informado',
                            validoDe: certificado.validoDe ? certificado.validoDe.split('T')[0] : '',
                            validoAte: certificado.validoAte ? certificado.validoAte.split('T')[0] : '',
                            statusCertificado: getStatusCertificado(certificado.validoDe, certificado.validoAte),
                            finalidadeCertificado,
                            observacoesTecnicas: certificado.observacoesTecnicas || 'Nenhuma observação',
                            coordenadasGPS: certificado.coordenadasGPS || '',
                            latitude: certificado.latitude || '',
                            longitude: certificado.longitude || '',
                            dadosOriginais: certificado
                        };
                    })
                    : [];

                setCertificados(certificadosMapeados);
                console.log('📋 Certificados processados:', certificadosMapeados);

            } catch (error) {
                console.error('❌ Erro ao buscar certificados:', error);
                if (error.response?.status === 404) {
                    setCertificados([]);
                } else {
                    showToast('error', 'Erro', `Erro ao carregar certificados do ${tipo}`);
                }
            } finally {
                setLoadingCertificados(false);
            }
        };

        fetchCertificados();
    }, [id, tipo, isProdutor, isOrganizacao]);

    const handleDownloadCertificado = async (certificado) => {
        try {
            setGerandoCertificado(certificado.id);
            console.log('🎯 Gerando certificado:', certificado);

            const responseCertificado = await api.get(`/certificaoDoProdutorFlorestal/${certificado.id}`);
            const dadosCompletos = responseCertificado.data;

            console.log('📋 Dados completos do certificado:', dadosCompletos);

            let tiposLicenca = [];
            if (dadosCompletos.tipoDeLicencaFlorestal && Array.isArray(dadosCompletos.tipoDeLicencaFlorestal)) {
                try {
                    const tiposString = dadosCompletos.tipoDeLicencaFlorestal[0];
                    if (tiposString) {
                        tiposLicenca = JSON.parse(tiposString);
                    }
                } catch (e) {
                    console.warn('Erro ao processar tipos de licença:', e);
                    tiposLicenca = dadosCompletos.tipoDeLicencaFlorestal;
                }
            }

            const dadosParaCertificado = {
                nomeCompleto: dadosCompletos.nomeCompleto || entidade?.nome_do_Produtor || entidade?.nome || 'N/A',
                nomeEntidade: dadosCompletos.nomeCompleto || entidade?.nome_do_Produtor || entidade?.nome || 'N/A',
                numBIOuNIF: dadosCompletos.numBIOuNIF || entidade?.bI_NIF || entidade?.nif || 'N/A',
                telefone: dadosCompletos.telefone || entidade?.contacto || entidade?.telefone || 'N/A',
                provincia: dadosCompletos.provincia || entidade?.provincia || 'N/A',
                municipio: dadosCompletos.municipio || entidade?.municipio || 'N/A',
                comuna: dadosCompletos.comuna || entidade?.comuna || 'N/A',

                numeroProcesso: certificado.numeroProcesso || `PROC-${certificado.id}`,
                numeroLicencaExploracao: certificado.numeroProcesso || `LIC-${certificado.id}`,
                tiposLicenca: tiposLicenca,
                totalDeCustos: dadosCompletos.totalDeCustos || 0,

                areasFlorestais: dadosCompletos.areaFlorestalLicenciadas || [],
                especiesAutorizadas: (dadosCompletos.especieciesFlorestaisAutorizadas || []).map(especie => ({
                    especie: especie.nomeCientifico || especie.nomeComum || 'Espécie não informada',
                    nomeComum: especie.nomeComum || '',
                    nomeCientifico: especie.nomeCientifico || '',
                    volumeAutorizado: especie.volumeAutorizado || 0,
                    unidade: especie.unidade || 'm³',
                    observacoes: especie.observacoes || ''
                })),

                historicoExploracoes: dadosCompletos.historicoDeExploracao || [],

                validadeInicio: dadosCompletos.validadeDe,
                validadeFim: dadosCompletos.validadeAte,
                validoDe: dadosCompletos.validadeDe,
                validoAte: dadosCompletos.validadeAte,

                tecnicoResponsavel: dadosCompletos.nomeDoTecnicoResponsavel || 'Não informado',
                nomeDoTecnicoResponsavel: dadosCompletos.nomeDoTecnicoResponsavel || 'Não informado',
                cargo: dadosCompletos.cargo || 'Técnico Florestal',
                cargoTecnico: dadosCompletos.cargo || 'Técnico Florestal',

                condicoesEspeciais: dadosCompletos.condicoesEspeciais || '',
                observacoes: dadosCompletos.observacoes || certificado.observacoesTecnicas || '',

                produtorFlorestalId: dadosCompletos.produtorFlorestalId || (isProdutor ? id : null),
                organizacaoId: dadosCompletos.organizacaoId || (isOrganizacao ? id : null),

                attachmentCertificadoFlorestals: dadosCompletos.attachmentCertificadoFlorestals || []
            };

            console.log('📊 Dados preparados para certificado:', dadosParaCertificado);

            const { gerarCertificadoFlorestal } = await import('./CertificadoFlorestalGenerator');

            const resultado = await gerarCertificadoFlorestal({
                dadosProdutor: dadosParaCertificado,
                areasFlorestais: dadosParaCertificado.areasFlorestais,
                especiesAutorizadas: dadosParaCertificado.especiesAutorizadas,
                historicoExploracoes: dadosParaCertificado.historicoExploracoes,
                tipoSelecionado: isOrganizacao ? 'Organização' : 'Produtor Florestal'
            });

            if (resultado && resultado.success) {
                showToast('success', 'Sucesso', resultado.message || 'Certificado gerado com sucesso!');
            } else {
                throw new Error(resultado?.message || 'Erro desconhecido ao gerar certificado');
            }

        } catch (error) {
            console.error('❌ Erro ao gerar certificado:', error);
            showToast('error', 'Erro', `Erro ao gerar certificado: ${error.message || error}`);
        } finally {
            setGerandoCertificado(null);
        }
    };

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

    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    const handleBack = () => {
        navigate('/GerenciaRNPA/certificados');
    };

    const handleSelectCertificado = (certificadoId) => {
        setSelectedCertificados(prev => {
            if (prev.includes(certificadoId)) {
                return prev.filter(idItem => idItem !== certificadoId);
            } else {
                return [...prev, certificadoId];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedCertificados.length === certificados.length) {
            setSelectedCertificados([]);
        } else {
            setSelectedCertificados(certificados.map(cert => cert.id));
        }
    };

    const handlePrintBatch = async () => {
        if (selectedCertificados.length === 0) {
            showToast('warning', 'Atenção', 'Selecione pelo menos um certificado para gerar');
            return;
        }

        try {
            showToast('info', 'Processando', `Gerando ${selectedCertificados.length} certificado(s)...`);

            for (const certificadoId of selectedCertificados) {
                const certificado = certificados.find(c => c.id === certificadoId);
                if (certificado) {
                    await handleDownloadCertificado(certificado);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            setSelectedCertificados([]);
            showToast('success', 'Concluído', 'Todos os certificados foram gerados!');

        } catch (error) {
            console.error('Erro ao gerar certificados em lote:', error);
            showToast('error', 'Erro', 'Erro ao gerar certificados em lote');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        } catch {
            return 'N/A';
        }
    };

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

    const getStatusColor = (status) => {
        const statusColors = {
            'ATIVO': 'bg-green-100 text-green-800 border-green-300',
            'EXPIRADO': 'bg-red-100 text-red-800 border-red-300',
            'PROXIMO_VENCIMENTO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'AGUARDANDO_VIGENCIA': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'ATIVO': 'Ativo',
            'EXPIRADO': 'Expirado',
            'PROXIMO_VENCIMENTO': 'Próximo ao Vencimento',
            'AGUARDANDO_VIGENCIA': 'Aguardando Vigência'
        };
        return statusLabels[status] || status;
    };

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
            case 'warning':
                bgColor = 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700';
                icon = <AlertTriangle className="w-5 h-5" />;
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

    if (!id || (!isProdutor && !isOrganizacao)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Toast />
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Parâmetros inválidos</h3>
                    <p className="text-gray-500 mb-6">
                        A URL não contém parâmetros válidos. Verifique o link e tente novamente.
                    </p>
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Certificados
                    </button>
                </div>
            </div>
        );
    }

    const tipoLabel = isOrganizacao ? 'Organização' : 'Produtor Florestal';

    return (
        <div className="min-h-screen bg-gray-50">
            <Toast />

            {/* Cabeçalho */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate(-1)}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Voltar"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Certificados - {tipoLabel}
                                </h1>
                                <p className="text-sm text-gray-500">Visualização e gestão de certificados</p>
                            </div>
                        </div>

                        {certificados.length > 0 && (
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">
                                    {selectedCertificados.length} de {certificados.length} selecionados
                                </span>
                                <button
                                    onClick={handleSelectAll}
                                    className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                >
                                    {selectedCertificados.length === certificados.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
                                </button>
                                <button
                                    onClick={handlePrintBatch}
                                    disabled={selectedCertificados.length === 0}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${selectedCertificados.length === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Gerar Selecionados
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Informações da Entidade */}
                {loadingEntidade ? (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="animate-pulse">
                            <div className="flex items-center">
                                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                                <div className="ml-6 space-y-3">
                                    <div className="h-6 bg-gray-300 rounded w-64"></div>
                                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                                    <div className="h-4 bg-gray-300 rounded w-56"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : entidade ? (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="flex items-start">
                            <EntidadeAvatar
                                entidade={entidade}
                                tipo={tipo}
                                size="w-20 h-20"
                                textSize="text-lg"
                            />
                            <div className="ml-6 flex-1">
                                <div className="flex items-center mb-2">
                                    {isOrganizacao && <Building2 className="w-5 h-5 mr-2 text-purple-600" />}
                                    {isProdutor && <User className="w-5 h-5 mr-2 text-blue-600" />}
                                    <span className="text-xs font-medium text-gray-500 uppercase">
                                        {tipoLabel}
                                    </span>
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {entidade.nome_do_Produtor || entidade.nome || entidade.nomeCompleto || 'Nome não informado'}
                                </h2>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="flex items-center text-gray-600">
                                        <IdCard className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="text-sm">
                                            {isOrganizacao ? 'NIF' : 'BI'}: {entidade.bI_NIF || entidade.nif || entidade.numBIOuNIF || 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="text-sm">{entidade.contacto || entidade.telefone || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                        <span className="text-sm">
                                            {entidade.municipio || 'N/A'}, {entidade.provincia?.toUpperCase() || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                        <div className="text-center py-4">
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">{tipoLabel} não encontrado(a)</h3>
                            <p className="text-gray-500">Não foi possível carregar os dados.</p>
                        </div>
                    </div>
                )}

                {/* Estatísticas dos certificados */}
                {!loadingCertificados && certificados.length > 0 && (
                    <div className="mt-8 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Award className="w-6 h-6 text-blue-600" />
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
                                        {certificados.filter(c => c.statusCertificado === 'ATIVO').length}
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
                                    <p className="text-sm font-medium text-gray-500">Próx. Vencimento</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {certificados.filter(c => c.statusCertificado === 'PROXIMO_VENCIMENTO').length}
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

                {/* Lista de Certificados */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Award className="w-6 h-6 mr-2 text-blue-600" />
                            Certificados ({certificados.length})
                        </h3>
                    </div>

                    {loadingCertificados ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-xl shadow-md p-6">
                                    <div className="animate-pulse">
                                        <div className="flex items-start">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                                            <div className="ml-4 flex-1 space-y-3">
                                                <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : certificados.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-md p-12 text-center">
                            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum certificado encontrado</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {isOrganizacao ? 'Esta organização' : 'Este produtor'} ainda não possui certificados cadastrados no sistema.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {certificados.map((certificado) => (
                                <div
                                    key={certificado.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden"
                                >
                                    {/* Header do Card */}
                                    <div className="p-6 border-b border-gray-100">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-sm">
                                                    <Award className="w-6 h-6" />
                                                </div>
                                                <div className="ml-4">
                                                    <h4 className="text-lg font-semibold text-gray-900">
                                                        {certificado.numeroProcesso}
                                                    </h4>
                                                    <p className="text-sm text-gray-600 mt-1">ID: {certificado.id}</p>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border mt-2 ${getStatusColor(certificado.statusCertificado)}`}
                                                    >
                                                        {getStatusLabel(certificado.statusCertificado)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Checkbox Seleção */}
                                            <div className="flex items-center space-x-2">
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedCertificados.includes(certificado.id)}
                                                        onChange={() => handleSelectCertificado(certificado.id)}
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">Selecionar</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Conteúdo do Card */}
                                    <div className="p-6 space-y-4">
                                        {/* Técnico e Vigência */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                    <User className="w-4 h-4 mr-1 text-blue-500" /> Técnico
                                                </h5>
                                                <p className="text-sm text-gray-900">{certificado.tecnicoResponsavel}</p>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-1 flex items-center">
                                                    <Calendar className="w-4 h-4 mr-1 text-blue-500" /> Vigência
                                                </h5>
                                                <p className="text-sm text-gray-900">
                                                    {formatDate(certificado.validoDe)} - {formatDate(certificado.validoAte)}
                                                </p>
                                                {certificado.statusCertificado === "PROXIMO_VENCIMENTO" && (
                                                    <p className="text-xs text-yellow-600 font-medium mt-1">
                                                        Vence em {getDaysToExpiry(certificado.validoAte)} dias
                                                    </p>
                                                )}
                                                {certificado.statusCertificado === "EXPIRADO" && (
                                                    <p className="text-xs text-red-600 font-medium mt-1">
                                                        Expirado há {Math.abs(getDaysToExpiry(certificado.validoAte))} dias
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Finalidades */}
                                        {certificado.finalidadeCertificado.length > 0 && (
                                            <div>
                                                <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                    <FileText className="w-4 h-4 mr-1 text-green-500" /> Finalidades
                                                </h5>
                                                <div className="flex flex-wrap gap-1">
                                                    {certificado.finalidadeCertificado.slice(0, 3).map((finalidade, index) => (
                                                        <span
                                                            key={index}
                                                            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200"
                                                        >
                                                            {finalidade.replace(/[-_]/g, " ").toUpperCase()}
                                                        </span>
                                                    ))}
                                                    {certificado.finalidadeCertificado.length > 3 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                                                            +{certificado.finalidadeCertificado.length - 3} mais
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Observações */}
                                        {certificado.observacoesTecnicas &&
                                            certificado.observacoesTecnicas !== "Nenhuma observação" && (
                                                <div className="pt-4 border-t border-gray-100">
                                                    <h5 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                        <Info className="w-4 h-4 mr-1 text-green-500" /> Observações
                                                    </h5>
                                                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                                        {certificado.observacoesTecnicas}
                                                    </p>
                                                </div>
                                            )}

                                        {/* Botão de Download Individual */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => handleDownloadCertificado(certificado)}
                                                disabled={gerandoCertificado === certificado.id}
                                                className={`w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${gerandoCertificado === certificado.id
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md"
                                                    }`}
                                            >
                                                {gerandoCertificado === certificado.id ? (
                                                    <>
                                                        <Clock className="w-4 h-4 mr-2 animate-spin" /> Gerando Certificado...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Download className="w-4 h-4 mr-2" /> Baixar Certificado
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualizarCertificadosFlorestal;