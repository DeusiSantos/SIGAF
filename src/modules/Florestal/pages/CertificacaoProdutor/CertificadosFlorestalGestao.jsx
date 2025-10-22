import axios from 'axios';
import {
    AlertCircle,
    AlertTriangle,
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Filter,
    Search,
    Trees,
    User,
    X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';

// Hook para buscar TODOS os certificados florestais
const useCertificadosFlorestais = () => {
    const [certificadosData, setCertificadosData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCertificados = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await axios.get(
                    'https://mwangobrainsa-001-site2.mtempurl.com/api/certificaoDoProdutorFlorestal/all',
                    { timeout: 10000 }
                );

                if (response.data && Array.isArray(response.data)) {
                    setCertificadosData(response.data);
                } else {
                    setCertificadosData([]);
                }
            } catch (error) {
                console.error('Erro ao buscar certificados florestais:', error);
                setError('Erro ao carregar dados dos certificados florestais');
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
const mapApiDataToCertificadoFlorestal = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((cert) => {
        const hoje = new Date();
        const validadeInicio = new Date(cert.validadeDe);
        const validadeFim = new Date(cert.validadeAte);

        // Determinar tipo de entidade
        const tipoEntidade = cert.produtorFlorestalId !== null ? 'PRODUTOR' :
            cert.organizacaoId !== null ? 'ORGANIZACAO' : 'DESCONHECIDO';

        // Calcular status do certificado
        const getStatusCertificado = (validoDe, validoAte) => {
            if (hoje > validoAte) return 'EXPIRADO';
            if (hoje < validoDe) return 'AGUARDANDO_VIGENCIA';

            const diasParaVencer = Math.ceil((validoAte - hoje) / (1000 * 60 * 60 * 24));
            if (diasParaVencer <= 90 && diasParaVencer > 0) return 'PROXIMO_CADUCIDADE';

            return 'ACTIVO';
        };

        // Obter tipos de licença
        let tiposLicenca = [];
        if (cert.tipoDeLicencaFlorestal && Array.isArray(cert.tipoDeLicencaFlorestal)) {
            tiposLicenca = cert.tipoDeLicencaFlorestal.map(tipo => {
                try {
                    return JSON.parse(tipo);
                } catch {
                    return [tipo];
                }
            }).flat();
        }

        // Calcular área total
        const areaTotal = cert.areaFlorestalLicenciadas?.reduce((sum, area) => sum + (area.area || 0), 0) || 0;

        // Calcular volume total
        const volumeTotal = cert.especieciesFlorestaisAutorizadas?.reduce((sum, esp) => sum + (esp.volumeAutorizado || 0), 0) || 0;

        return {
            id: cert.id,
            produtorFlorestalId: cert.produtorFlorestalId,  // ← Adicionar
            organizacaoId: cert.organizacaoId,
            entidadeId: cert.produtorFlorestalId || cert.organizacaoId,
            tipoEntidade: tipoEntidade,
            numeroProcesso: `CERT-FL-${cert.id}`,
            nomeCompleto: cert.nomeCompleto || 'Nome não informado',
            numBIOuNIF: cert.numBIOuNIF || 'N/A',
            telefone: cert.telefone || 'N/A',
            provincia: cert.provincia || 'N/A',
            municipio: cert.municipio || 'N/A',
            comuna: cert.comuna || 'N/A',
            tiposLicenca: tiposLicenca,
            tipoLicencaPrincipal: tiposLicenca[0] || 'Não especificado',
            totalDeCustos: cert.totalDeCustos || 0,
            areaFlorestalLicenciadas: cert.areaFlorestalLicenciadas || [],
            areaTotal: areaTotal,
            especieciesFlorestaisAutorizadas: cert.especieciesFlorestaisAutorizadas || [],
            volumeTotal: volumeTotal,
            validoDe: validadeInicio.toISOString().split('T')[0],
            validoAte: validadeFim.toISOString().split('T')[0],
            statusCertificado: getStatusCertificado(validadeInicio, validadeFim),
            nomeDoTecnicoResponsavel: cert.nomeDoTecnicoResponsavel || 'N/A',
            cargo: cert.cargo || 'N/A',
            condicoesEspeciais: cert.condicoesEspeciais || 'Nenhuma',
            observacoes: cert.observacoes || 'Nenhuma',
            // Campos compatíveis com o código antigo
            produtor: {
                nome: cert.nomeCompleto || 'Nome não informado',
                bi: cert.numBIOuNIF || 'N/A',
                telefone: cert.telefone || 'N/A',
                provincia: cert.provincia || 'N/A',
                municipio: cert.municipio || 'N/A',
                comuna: cert.comuna || 'N/A',
            }
        };
    });
};

const CertificadosFlorestalGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTipoEntidade, setSelectedTipoEntidade] = useState('');
    const [selectedTipoLicenca, setSelectedTipoLicenca] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [certificados, setCertificados] = useState([]);
    const itemsPerPage = 5;
    const containerRef = useRef(null);

    const { certificadosData, loading, error } = useCertificadosFlorestais();

    console.log("Dados da API (certificados):", certificadosData);

    // Carregar e mapear certificados quando dados mudarem
    useEffect(() => {
        if (certificadosData && certificadosData.length > 0) {
            try {
                const certificadosMapeados = mapApiDataToCertificadoFlorestal(certificadosData);
                setCertificados(certificadosMapeados);
                console.log("Certificados mapeados:", certificadosMapeados);
            } catch (error) {
                console.error('Erro ao mapear certificados:', error);
                showToast('error', 'Erro', 'Erro ao processar dados dos certificados');
            }
        } else {
            setCertificados([]);
        }
    }, [certificadosData]);

    const handleViewCertificado = (cert) => {
        const entidadeId = cert.entidadeId;
        const tipoEntidade = cert.tipoEntidade === 'ORGANIZACAO' ? 'organizacao' : 'produtor';

        if (!entidadeId) {
            showToast('error', 'Erro', 'ID da entidade não encontrado');
            return;
        }

        navigate(`/GerenciaRNPA/gestao-florestal/visualizarCertificado/${tipoEntidade}/${entidadeId}`);
    };

    // Função para mostrar toast
    const showToast = (type, title, message) => {
        setToastMessage({ type, title, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Avatar do produtor
    const ProdutorAvatar = ({ produtor, size = "w-20 h-20", textSize = "text-lg" }) => {
        const getInitials = (nome) => {
            if (!nome) return 'PF';
            return nome.split(' ')
                .map(n => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
        };

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
                certificado.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.numBIOuNIF.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.telefone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                certificado.provincia.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = !selectedStatus || certificado.statusCertificado === selectedStatus;
            const matchesTipoEntidade = !selectedTipoEntidade || certificado.tipoEntidade === selectedTipoEntidade;
            const matchesLicenca = !selectedTipoLicenca ||
                (certificado.tiposLicenca && certificado.tiposLicenca.some(tipo => tipo.includes(selectedTipoLicenca)));

            return matchesSearch && matchesStatus && matchesTipoEntidade && matchesLicenca;
        });
    }, [certificados, searchTerm, selectedStatus, selectedTipoEntidade, selectedTipoLicenca]);

    // Estatísticas
    const estatisticas = useMemo(() => {
        const produtores = certificados.filter(c => c.tipoEntidade === 'PRODUTOR');
        const organizacoes = certificados.filter(c => c.tipoEntidade === 'ORGANIZACAO');

        return {
            total: certificados.length,
            produtores: produtores.length,
            organizacoes: organizacoes.length,
            activos: certificados.filter(c => c.statusCertificado === 'ACTIVO').length,
            proximoVenc: certificados.filter(c => c.statusCertificado === 'PROXIMO_CADUCIDADE').length,
            expirados: certificados.filter(c => c.statusCertificado === 'EXPIRADO').length
        };
    }, [certificados]);

    // Reset página quando filtros mudarem
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, selectedTipoEntidade, selectedTipoLicenca]);

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

    // Calcular dias restantes
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

    // Exportar dados
    const handleExportData = () => {
        try {
            const dataToExport = filteredCertificados.map(cert => ({
                'Tipo': cert.tipoEntidade === 'PRODUTOR' ? 'Produtor' : 'Organização',
                'Número do Processo': cert.numeroProcesso,
                'Nome Completo': cert.nomeCompleto,
                'BI/NIF': cert.numBIOuNIF,
                'Telefone': cert.telefone,
                'Província': cert.provincia,
                'Município': cert.municipio,
                'Comuna': cert.comuna,
                'Tipos de Licença': cert.tiposLicenca.join(', '),
                'Área Total (ha)': cert.areaTotal,
                'Volume Total (m³)': cert.volumeTotal,
                'Custos Totais': cert.totalDeCustos,
                'Válido De': formatDate(cert.validoDe),
                'Válido Até': formatDate(cert.validoAte),
                'Estado': getStatusLabel(cert.statusCertificado),
                'Técnico Responsável': cert.nomeDoTecnicoResponsavel
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
    const tiposLicencaUnicos = [...new Set(
        certificados.flatMap(c => c.tiposLicenca)
    )].filter(Boolean);

    return (
        <div>
            <Toast />

            {/* Estatísticas */}
            {!loading && certificados.length > 0 && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Trees className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
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
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Building2 className="w-6 h-6 text-purple-600" />
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
                </div>
            )}

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-green-700 to-green-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Certificados Florestais</h1>
                            <p className="text-green-100 mt-1">Produtores e Organizações com certificados florestais</p>
                        </div>
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

                {/* Barra de filtros */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Busca */}
                        <div>
                            <CustomInput
                                type="text"
                                placeholder="Pesquisar por nome, BI, processo..."
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

                {/* Tabela */}
                <div className="overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                            <span className="ml-3 text-gray-600">Carregando certificados...</span>
                        </div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Produtor</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Certificado</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Localização</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Dados</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Validade</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase">Acção</th>

                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-start bg-white">
                                {getCurrentItems().map((cert) => (
                                    <tr key={cert.id} className="hover:bg-green-50 transition-colors text-s">

                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <ProdutorAvatar produtor={cert.produtor} size="w-20 h-20" textSize="text-xl" />
                                                <div className="ml-3">
                                                    <div className="text-sm font-semibold text-gray-900">{cert.nomeCompleto}</div>
                                                    <div className="text-xs text-gray-600">BI/NIF: {cert.numBIOuNIF}</div>
                                                    <div className="text-xs text-gray-600">Tel: {cert.telefone}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{cert.numeroProcesso}</div>
                                            <div className="text-xs text-gray-600 mt-1">
                                                {cert.tipoLicencaPrincipal}
                                            </div>
                                            {cert.tiposLicenca.length > 1 && (
                                                <div className="text-xs text-gray-500">+{cert.tiposLicenca.length - 1} mais</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-700">{cert.provincia}</div>
                                            <div className="text-xs text-gray-600">{cert.municipio}</div>
                                            <div className="text-xs text-gray-500">{cert.comuna}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-gray-700">Área: {cert.areaTotal} ha</div>
                                            <div className="text-xs text-gray-700">Volume: {cert.volumeTotal} m³</div>
                                            <div className="text-xs text-gray-600">Custo: {cert.totalDeCustos.toLocaleString()} AKZ</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="text-xs text-gray-700">{formatDate(cert.validoDe)}</div>
                                            <div className="text-xs text-gray-500">até</div>
                                            <div className="text-xs text-gray-700">{formatDate(cert.validoAte)}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(cert.statusCertificado)}`}>
                                                {getStatusLabel(cert.statusCertificado)}
                                            </span>
                                            {cert.statusCertificado === 'PROXIMO_CADUCIDADE' && (
                                                <div className="text-xs text-yellow-600 font-medium mt-1">
                                                    {getDaysToExpiry(cert.validoAte)} dias
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleViewCertificado(cert)}
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
                                        'bg-white text-green-700 hover:bg-green-50 border border-green-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                        'bg-white text-green-700 hover:bg-green-50 border border-green-200'
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
                        <Trees className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {certificados.length === 0 ? 'Nenhum certificado encontrado' : 'Nenhum resultado encontrado'}
                        </h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            {certificados.length === 0
                                ? 'Ainda não existem certificados florestais registados no sistema.'
                                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros.'}
                        </p>
                        {(searchTerm || selectedStatus || selectedTipoEntidade || selectedTipoLicenca) && (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedStatus('');
                                    setSelectedTipoEntidade('');
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
    );
};

export default CertificadosFlorestalGestao;