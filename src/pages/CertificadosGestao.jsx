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
    Tractor,
    Phone,
    IdCard
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import CustomInput from '../components/CustomInput';
import { useCertificadoProdutor } from '../hooks/useCertificadoProdutor';
import { useCertificados } from '../hooks/useRnpaData';
import axios from 'axios';

// Função para mapear os dados da API diretamente dos produtores (sem buscar dados extras)
const mapApiDataToCertificado = (apiData) => {
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

        // Simular dados do certificado baseado no produtor
        const hoje = new Date();
        const dataInicio = new Date(produtor.registration_date);
        const dataFim = new Date(dataInicio);
        dataFim.setFullYear(dataFim.getFullYear() + 2); // Certificado válido por 2 anos

        // Calcular status do certificado
        const getStatusCertificado = (validoDe, validoAte) => {
            if (hoje < validoDe) return 'AGUARDANDO_VIGENCIA';
            if (hoje > validoAte) return 'EXPIRADO';

            const diasParaVencer = Math.ceil((validoAte - hoje) / (1000 * 60 * 60 * 24));
            if (diasParaVencer <= 30 && diasParaVencer > 0) return 'PROXIMO_CADUCIDADE';

            return 'ACTIVO';
        };

        // Determinar actividade principal
        const atividades = produtor.atividades_produtor || '';
        let atividadePrincipal = 'Não informado';

        if (atividades.includes('agricultura')) atividadePrincipal = 'Agricultura';
        else if (atividades.includes('pecuaria')) atividadePrincipal = 'Pecuária';
        else if (atividades.includes('agropecuaria')) atividadePrincipal = 'Agropecuária';
        else if (atividades.includes('aquicultura')) atividadePrincipal = 'Aquicultura';
        else if (atividades.includes('produtos_florestais')) atividadePrincipal = 'Produtos Florestais';

        const coordenadas = getCoordinates(produtor.gps_coordinates);

        return {
            id: produtor._id?.toString(),
            produtorId: produtor._id,
            numeroProcesso: `CERT-${produtor._id}`,
            nomeDaPropriedade: `Exploração de ${produtor.beneficiary_name || 'Sem nome'}`,
            atividadePrincipal,
            areaTotalExplorada: parseFloat(produtor.area_total) || 0,
            tecnicoResponsavel: `${produtor.nome_inquiridor || ''} ${produtor.sobrenome_inquiridor || ''}`.trim() || 'Não informado',
            validoDe: dataInicio.toISOString().split('T')[0],
            validoAte: dataFim.toISOString().split('T')[0],
            statusCertificado: getStatusCertificado(dataInicio, dataFim),
            finalidadeCertificado: ['Acesso ao crédito rural', 'Programas governamentais'],
            observacoesTecnicas: produtor.observacoes_gerais || 'Nenhuma observação',
            coordenadasGPS: coordenadas,
            latitude: coordenadas.lat.toString(),
            longitude: coordenadas.lng.toString(),
            historicoProducaoAgricola: 1,
            historicoProducaoPecuaria: atividades.includes('pecuaria') ? 1 : 0,
            historicoVistorias: 1,
            // Dados do produtor
            produtor: {
                nome: produtor.beneficiary_name ||
                    `${produtor.nome_produtor || ''} ${produtor.nome_meio_produtor || ''} ${produtor.sobrenome_produtor || ''}`.trim() ||
                    'Nome não informado',
                bi: produtor.beneficiary_id_number || 'N/A',
                telefone: produtor.beneficiary_phone_number || 'N/A',
                codigoInquilidor: produtor.codigo_inquiridor || 'N/A',
                provincia: (produtor.provincia || 'N/A').toUpperCase(),
                municipio: produtor.municipio || 'N/A',
                comuna: produtor.comuna || 'N/A',
                bairro: produtor.geo_level_4 || 'N/A',
                dataNascimento: produtor.beneficiary_date_of_birth ?
                    new Date(produtor.beneficiary_date_of_birth).toISOString().split('T')[0] : 'N/A',
                estadoCivil: produtor.estado_civil || 'N/A',
                genero: produtor.beneficiary_gender === 'm' ? 'Masculino' :
                    produtor.beneficiary_gender === 'f' ? 'Feminino' : 'N/A',
                escolaridade: produtor.nivel_escolaridade || 'N/A',
                tipoDocumento: produtor.tipo_documento || 'N/A',
                atividades: atividades,
                estado: produtor.estado || 'Pendente',
                permissao: produtor.permissao || 'nao',
                acessoTerra: produtor.acesso_terra || 'nao',
                proprietario: produtor.e_proprietario || 'nao',
                tituloTerra: produtor.titulo_terra || 'nao',
                totalAgregado: parseInt(produtor.total_agregado) || 0,
                dataRegistro: produtor.registration_date
            }
        };
    });
};

const CertificadosGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedAtividade, setSelectedAtividade] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [certificados, setCertificados] = useState([]);
    const itemsPerPage = 5;
    const containerRef = useRef(null);
    const { certificado, loading: loadingCertificado } = useCertificados();

    console.log("Dados da API (produtores com certificados):", certificado);
    const { certificadoProdutores, loading, error } = useCertificadoProdutor();

    // Carregar e mapear certificados quando dados mudarem
    useEffect(() => {
        if (certificado && certificado.length > 0) {
            try {
                const certificadosMapeados = mapApiDataToCertificado(certificado);
                setCertificados(certificadosMapeados);
                console.log("Certificados mapeados:", certificadosMapeados);
            } catch (error) {
                console.error('Erro ao mapear certificados:', error);
                showToast('error', 'Erro', 'Erro ao processar dados dos certificados');
            }
        } else {
            setCertificados([]);
        }
    }, [certificado]);

    // Carregar certificados dos produtores quando certificadoProdutores mudar
    useEffect(() => {
        const loadCertificados = async () => {
            if (certificadoProdutores && certificadoProdutores.length > 0) {
                try {
                    const certificadosMapeados = await mapApiDataToCertificado(certificadoProdutores);
                    setCertificados(certificadosMapeados);
                } catch (error) {
                    console.error('Erro ao mapear certificados:', error);

                }
            } else {
                setCertificados([]);
            }
        };
        loadCertificados();
    }, [certificadoProdutores]);

    // Mostrar toast de erro se necessário
    useEffect(() => {
        if (!loading && !certificadoProdutores && certificadoProdutores !== null) {
            showToast('error', 'Erro', 'Erro ao carregar dados dos certificados');
        }
    }, [loading, certificadoProdutores]);

    useEffect(() => {
        if (error) {
            showToast('error', 'Erro', error);
        }
    }, [error]);

    console.log('Certificados da API:', certificadoProdutores);
    console.log('Certificados mapeados:', certificados);

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

    // Navegação para visualizar certificados do produtor
    const handleViewCertificado = (produtorId) => {
        navigate(`/GerenciaRNPA/certificados/visualizar/${produtorId}`);
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
            if (!nome) return 'P';
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
                        `https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/${produtor.id}/foto-beneficiary`,
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
                    console.error('Erro ao carregar foto do produtor:', error);
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
                <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center shadow-sm animate-pulse`}>
                    <User className="w-6 h-6 text-gray-400" />
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
            <div className={`${size} rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {getInitials(produtor?.nome)}
            </div>
        );
    };

    // Filtragem dos certificados
    const filteredCertificados = useMemo(() => {
        return certificados.filter(certificado => {
            const matchesSearch =
                certificado.nomeDaPropriedade.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.tecnicoResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.bi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.codigoInquilidor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.produtor.telefone.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !selectedStatus || certificado.statusCertificado === selectedStatus;
            const matchesAtividade = !selectedAtividade || certificado.atividadePrincipal === selectedAtividade;

            return matchesSearch && matchesStatus && matchesAtividade;
        });
    }, [certificados, searchTerm, selectedStatus, selectedAtividade]);

    // Reset página quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedAtividade]);

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

    // Exportar dados dos certificados
    const handleExportData = () => {
        try {
            const dataToExport = filteredCertificados.map(cert => ({
                'Número do Processo': cert.numeroProcesso,
                'Nome do Produtor': cert.produtor.nome,
                'BI': cert.produtor.bi,
                'Telefone': cert.produtor.telefone,
                'Província': cert.produtor.provincia,
                'Município': cert.produtor.municipio,
                'Atividade Principal': cert.atividadePrincipal,
                'Propriedade': cert.nomeDaPropriedade,
                'Superfície Total': cert.areaTotalExplorada,
                'Técnico Responsável': cert.tecnicoResponsavel,
                'Válido De': formatDate(cert.validoDe),
                'Válido Até': formatDate(cert.validoAte),
                'Estado': getStatusLabel(cert.statusCertificado),
                'Código Inquiridor': cert.produtor.codigoInquilidor
            }));

            const csv = [
                Object.keys(dataToExport[0]).join(','),
                ...dataToExport.map(row => Object.values(row).join(','))
            ].join('\n');

            const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `certificados_rnpa_${new Date().toISOString().split('T')[0]}.csv`);
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
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
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
            'PROXIMO_VENCIMENTO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'AGUARDANDO_VIGENCIA': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Labels para estados
    const getStatusLabel = (status) => {
        const statusLabels = {
            'ACTIVO': 'Activo',
            'EXPIRADO': 'Expirado',
            'PROXIMO_VENCIMENTO': 'Próximo ao Vencimento',
            'AGUARDANDO_VIGENCIA': 'Aguardando Vigência'
        };
        return statusLabels[status] || status;
    };

    // Opções para filtros
    const atividadesUnicas = [...new Set(certificados.map(c => c.atividadePrincipal))].filter(Boolean);

    return (

        <div>
            {/* Estatísticas dos certificados */}
            {!loadingCertificado && certificados.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                <p className="text-sm font-medium text-gray-500">Activo</p>
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
                                <p className="text-sm font-medium text-gray-500">Vencido</p>
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
                                <p className="text-sm font-medium text-gray-500">Expirado</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {certificados.filter(c => c.statusCertificado === 'Expirado').length}
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
                    <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                            <div>
                                <h1 className="text-2xl font-bold">Gestão de Certificados</h1>
                            </div>



                            <div className="flex gap-4">
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
                    </div>

                    {/* Barra de ferramentas */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Busca */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="text"
                                    placeholder="Pesquisar por nome, BI, telemóvel, exploração, processo..."
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
                                        { label: 'Próximo ao Vencimento', value: 'PROXIMO_VENCIMENTO' },
                                        { label: 'Expirado', value: 'EXPIRADO' },
                                        { label: 'Aguardando Vigência', value: 'AGUARDANDO_VIGENCIA' }
                                    ]}
                                    onChange={(option) => setSelectedStatus(option?.value || '')}
                                    iconStart={<Filter size={18} />}
                                />
                            </div>

                            {/* Filtro Atividade */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Actividade Principal"
                                    value={selectedAtividade ? { label: selectedAtividade, value: selectedAtividade } : null}
                                    options={[
                                        { label: 'Todas as Actividades', value: '' },
                                        ...atividadesUnicas.map(atividade => ({
                                            label: atividade,
                                            value: atividade
                                        }))
                                    ]}
                                    onChange={(option) => setSelectedAtividade(option?.value || '')}
                                    iconStart={<Tractor size={18} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabela - Desktop */}
                    <div className="hidden md:block">
                        {loadingCertificado ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Carregando certificados...</span>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                <span className="ml-3 text-gray-600">
                                    {loading ? 'Carregando certificados...' : 'Carregando dados dos produtores...'}
                                </span>
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Produtor
                                        </th>


                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Certificado
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
                                        <tr key={certificado.id} className="hover:bg-blue-50 transition-colors">
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
                                                        <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line max-w-[290px]">{certificado.produtor.nome}</div>
                                                        <div className="flex items-center text-xs text-gray-600 mt-1">
                                                            <IdCard className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                            BI: {certificado.produtor.bi}
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                            {certificado.produtor.telefone}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Código: {certificado.produtor.codigoInquilidor}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>





                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    <div className="flex items-center text-sm font-medium text-gray-900 ">
                                                        <Award className="w-4 h-4 mr-2 text-blue-500" />
                                                        {certificado.numeroProcesso}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-700">
                                                        <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                        {formatDate(certificado.validoDe)} - {formatDate(certificado.validoAte)}
                                                    </div>
                                                    {certificado.statusCertificado === 'PROXIMO_CADUCIDADE' && (
                                                        <div className="text-xs text-yellow-600 font-medium">
                                                            Caduca em {getDaysToExpiry(certificado.validoAte)} dias
                                                        </div>
                                                    )}
                                                    {certificado.statusCertificado === 'EXPIRADO' && (
                                                        <div className="text-xs text-red-600 font-medium">
                                                            Expirado há {Math.abs(getDaysToExpiry(certificado.validoAte))} dias
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
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button
                                                        onClick={() => handleViewCertificado(certificado.produtorId)}
                                                        className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                        title="Ver certificados do produtor"
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
                        {loadingCertificado ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Carregando certificados...</span>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                                <span className="ml-3 text-gray-600">
                                    {loading ? 'Carregando certificados...' : 'Carregando dados dos produtores...'}
                                </span>
                            </div>
                        ) : (
                            getCurrentItems().map((certificado) => (
                                <div key={certificado.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <div className="flex items-start">
                                        <ProdutorAvatar
                                            produtor={{
                                                id: certificado.produtorId,
                                                nome: certificado.produtor.nome
                                            }}
                                            size="w-20 h-20"
                                            textSize="text-lg"
                                        />
                                        <div className="flex-1 ml-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{certificado.produtor.nome}</h3>
                                                    <div className="text-xs text-gray-500 mt-1">BI: {certificado.produtor.bi}</div>
                                                    <div className="text-xs text-gray-500">Código: {certificado.produtor.codigoInquilidor}</div>
                                                </div>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(certificado.statusCertificado)}`}>
                                                    {getStatusLabel(certificado.statusCertificado)}
                                                </span>
                                            </div>

                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                    {certificado.produtor.telefone}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                    {certificado.produtor.municipio}, {certificado.produtor.provincia}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Tractor className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                    {certificado.atividadePrincipal}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Award className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                    {certificado.numeroProcesso}
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                    {formatDate(certificado.validoDe)} - {formatDate(certificado.validoAte)}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Exploração: {certificado.nomeDaPropriedade}
                                                    {certificado.areaTotalExplorada > 0 && ` | Superfície Total: ${certificado.areaTotalExplorada} ha`}
                                                </div>
                                            </div>

                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleViewCertificado(certificado.produtorId)}
                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                        title="Ver certificados"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => showToast('info', 'Produtor', `Informações do produtor ${certificado.produtor.nome}`)}
                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                        title="Informações"
                                                    >
                                                        <Info className="w-4 h-4" />
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
                    {!loadingCertificado && filteredCertificados.length > 0 && (
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
                                                : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
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

                    {/* Nenhum resultado encontrado */}
                    {!loadingCertificado && filteredCertificados.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <Award className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {certificados.length === 0 ? 'Nenhum certificado encontrado' : 'Nenhum certificado encontrado'}
                            </h3>
                            <p className="text-gray-500 max-w-md mb-6">
                                {certificados.length === 0
                                    ? 'Ainda não existem certificados registados no sistema.'
                                    : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros aplicados.'
                                }
                            </p>
                            {(searchTerm || selectedStatus || selectedAtividade) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedStatus('');
                                        setSelectedAtividade('');
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
        </div>

    );
};

export default CertificadosGestao;