import axios from 'axios';
import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Award,
    BookOpen,
    Calculator,
    Calendar,
    Calendar as CalendarIcon,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    CreditCard,
    DollarSign,
    Download,
    Edit,
    Eye,
    FileText,
    Gift,
    Hash,
    ImageIcon,
    Info,
    MapPin,
    Package,
    Percent,
    Phone,
    RefreshCw,
    Save,
    Search,
    ShoppingCart,
    Target,
    TrendingUp,
    Truck,
    UserCheck,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';
import api from '../../../../core/services/api';
//import { RefreshCw } from 'lucide-react';
// Mock do CustomInput


const VisualizarIncentivo = () => {
    // ✅ USANDO useParams CORRETAMENTE
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados principais
    const [incentivo, setIncentivo] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Estados para a tabela de produtores
    const [produtores, setProdutores] = useState([]);
    const [loadingProdutores, setLoadingProdutores] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [produtoresPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatusValue, setPendingStatusValue] = useState(null);
    // Opções para selects
    const tipoIncentivoOptions = [
        { label: 'Dinheiro', value: 'DINHEIRO' },
        { label: 'Produto', value: 'PRODUTO' },
        { label: 'Serviço', value: 'SERVICO' }
    ];

    const formaPagamentoOptions = [
        { label: 'Numerário', value: 'NUMERARIO' },
        { label: 'Transferência Bancária', value: 'TRANSFERENCIA' },
        { label: 'Entrega Física', value: 'ENTREGA_FISICA' },
        { label: 'Voucher', value: 'VOUCHER' }
    ];

    const formaEntregaOptions = [
        { label: 'Balcão', value: 'BALCAO' },
        { label: 'Domicílio', value: 'DOMICILIO' },
        { label: 'Centro de Distribuição', value: 'CENTRO_DISTRIBUICAO' },
        { label: 'Cooperativa', value: 'COOPERATIVA' }
    ];

    const unidadeOptions = [
        { label: 'Quilogramas (kg)', value: 'KG' },
        { label: 'Gramas (g)', value: 'G' },
        { label: 'Toneladas (t)', value: 'T' },
        { label: 'Litros (l)', value: 'L' },
        { label: 'Unidades', value: 'UNIDADE' },
        { label: 'Sacos', value: 'SACO' },
        { label: 'Caixas', value: 'CAIXA' }
    ];

    const statusOptions = [
        { label: 'Activo', value: 'ACTIVO' },
        { label: 'Inativo', value: 'INATIVO' },
        { label: 'Suspenso', value: 'SUSPENSO' },
        { label: 'Expirado', value: 'EXPIRADO' }
    ];

    const ProdutorAvatar = ({
        produtor,
        size = "w-16 h-16",
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
                            timeout: 10000, // 10 segundos de timeout
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

            // Cleanup: revogar URL do blob quando componente for desmontado
            return () => {
                if (imageUrl) {
                    URL.revokeObjectURL(imageUrl);
                }
            };
        }, [produtor?.id]);

        // Se está carregando, mostrar spinner ou placeholder
        if (imageLoading && showLoadingSpinner) {
            return (
                <div className={`${size} rounded-full bg-gray-200 flex items-center justify-center shadow-sm animate-pulse`}>
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                </div>
            );
        }

        // Se a imagem carregou com sucesso, mostrar a foto
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

        // Fallback: mostrar iniciais com gradient
        return (
            <div className={`${size} rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold ${textSize} shadow-sm`}>
                {getInitials(produtor?.nome)}
            </div>
        );
    };

    // ✅ BUSCAR DADOS DO INCENTIVO COM AXIOS
    const fetchIncentivo = async () => {
        if (!id) {
            setLoading(false);
            showToast('error', 'ID do incentivo não fornecido');
            return;
        }

        setLoading(true);
        try {
            console.log(`📡 Buscando incentivo com ID: ${id}`);

            const response = await api.get(`/incentivo/${id}`);

            const data = response.data;
            console.log('📊 Dados recebidos:', data);

            // Processar e normalizar dados
            const processedData = {
                ...data,
                nomeDoIncentivo: data.nomeDoIncentivo || "",
                descricaoDoIncentivo: data.descricaoDoIncentivo || "",
                tipoDoIncentivo: data.tipoDoIncentivo || "",
                nomeDoProduto: data.nomeDoProduto || "",
                unidade: data.unidade || "",
                formaDePagamento: data.formaDePagamento || "",
                formaDeEntrega: data.formaDeEntrega || "",
                observacoes: data.observacoes || "",
                valorPorProduto: data.valorPorProduto || 0,
                valorDoReembolso: data.valorDoReembolso || 0,
                quantidadePorProduto: data.quantidadePorProduto || 0,
                valorPorKg: data.valorPorKg || 0,
                status: data.status || 'ATIVO'
            };

            // Processar data de vencimento
            if (processedData.dataDeVencimentoDoIncentivo) {
                processedData.dataDeVencimentoDoIncentivo =
                    processedData.dataDeVencimentoDoIncentivo.split('T')[0];
            }

            setIncentivo(processedData);
            setFormData(processedData);
            showToast('success', 'Dados carregados com sucesso');

        } catch (error) {
            console.error('💥 Erro ao buscar incentivo:', error);

            let errorMessage = 'Erro ao carregar dados do incentivo';

            if (error.response) {
                // Erro da API
                errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || 'Dados não encontrados'}`;
            } else if (error.request) {
                // Erro de rede
                errorMessage = 'Erro de conexão. Verifique sua internet.';
            } else {
                // Erro de configuração
                errorMessage = error.message;
            }

            showToast('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // ✅ BUSCAR PRODUTORES DO INCENTIVO
    const fetchProdutores = async () => {
        if (!id) return;

        setLoadingProdutores(true);
        try {
            console.log(`📡 Buscando produtores para incentivo ID: ${id}`);

            const response = await axios.get(
                `https://mwangobrainsa-001-site2.mtempurl.com/api/distribuicaoDeIncentivo/incentivo/${id}/produtores`
            );

            console.log('👥 Produtores recebidos:', response.data);
            setProdutores(response.data || []);

        } catch (error) {
            console.error('💥 Erro ao buscar produtores:', error);
            showToast('error', 'Erro ao carregar lista de produtores');
            setProdutores([]);
        } finally {
            setLoadingProdutores(false);
        }
    };

    // ✅ SALVAR DADOS COM AXIOS
    const saveIncentivo = async () => {
        setSaving(true);
        try {
            const dataToSend = {
                command: "UPDATE",
                id: parseInt(id),
                nomeDoIncentivo: formData.nomeDoIncentivo || null,
                descricaoDoIncentivo: formData.descricaoDoIncentivo || null,
                tipoDoIncentivo: typeof formData.tipoDoIncentivo === 'object'
                    ? formData.tipoDoIncentivo.value
                    : formData.tipoDoIncentivo || null,
                valorPorProduto: parseFloat(formData.valorPorProduto) || 0,
                valorDoReembolso: parseFloat(formData.valorDoReembolso) || 0,
                nomeDoProduto: formData.nomeDoProduto || null,
                quantidadePorProduto: parseInt(formData.quantidadePorProduto) || 0,
                valorPorKg: parseFloat(formData.valorPorKg) || 0,
                unidade: typeof formData.unidade === 'object'
                    ? formData.unidade.value
                    : formData.unidade || null,
                formaDePagamento: typeof formData.formaDePagamento === 'object'
                    ? formData.formaDePagamento.value
                    : formData.formaDePagamento || null,
                formaDeEntrega: typeof formData.formaDeEntrega === 'object'
                    ? formData.formaDeEntrega.value
                    : formData.formaDeEntrega || null,
                dataDeVencimentoDoIncentivo: formData.dataDeVencimentoDoIncentivo
                    ? new Date(formData.dataDeVencimentoDoIncentivo).toISOString()
                    : null,
                observacoes: formData.observacoes || null,
                status: typeof formData.status === 'object'
                    ? formData.status.value
                    : formData.status || 'ATIVO'
            };

            console.log('💾 Salvando dados:', dataToSend);

            const response = await api.put(`/incentivo/${id}`, dataToSend);

            console.log('✅ Resposta do salvamento:', response.data);

            setIncentivo(formData);
            showToast('success', 'Incentivo atualizado com sucesso!');
            setIsEditing(false);

        } catch (error) {
            console.error('💥 Erro ao salvar incentivo:', error);

            let errorMessage = 'Erro ao salvar dados';

            if (error.response) {
                errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || 'Falha ao salvar'}`;
            } else if (error.request) {
                errorMessage = 'Erro de conexão. Tente novamente.';
            }

            showToast('error', errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // Carregar dados ao montar o componente
    useEffect(() => {
        fetchIncentivo();
        fetchProdutores();
    }, [id]);

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEditClick = () => {
        setIsEditing(true);
        showToast('info', 'Modo de edição ativado');
    };

    const handleCancelEdit = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        setFormData(incentivo);
        setShowCancelModal(false);
        showToast('info', 'Edição cancelada');
    };

    const handleSave = async () => {
        try {
            if (!formData.nomeDoIncentivo) {
                showToast('error', 'Nome do incentivo é obrigatório');
                return;
            }

            await saveIncentivo();
        } catch (error) {
            showToast('error', 'Erro ao salvar dados. Tente novamente.');
            console.error(error);
        }
    };

    const handleBack = () => {
        navigate('/GerenciaRNPA/gestao-agricultores/incentivos');
    };

    {/*   const handleStatusChange = async (value) => {
        const novoStatus = value?.value || value;
        const statusLabel = value?.label || value;

        const confirmar = window.confirm(`Deseja alterar o status para: ${statusLabel}?`);
        if (!confirmar) return;

        try {
            const updatedData = { ...formData, status: novoStatus };
            setFormData(updatedData);

            if (!isEditing) {
                setIncentivo(updatedData);
            }

            showToast('success', `Status alterado para ${statusLabel} com sucesso!`);
        } catch (error) {
            showToast('error', 'Erro ao alterar status');
            console.error(error);
        }
    };  */}

    const formatDate = (dateString) => {
        if (!dateString) return '0';
        try {
            return new Date(dateString).toLocaleDateString('pt-BR');
        } catch (error) {
            console.error(error);
            return '0';
        }
    };

    const formatCurrency = (value) => {
        if (!value || value === 0) return '0';
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 2
        }).format(value);
    };

    const getStatusColor = (status) => {
        const colors = {
            'ACTIVO': 'bg-green-100 text-green-800 border-green-300',
            'INATIVO': 'bg-red-100 text-red-800 border-red-300',
            'SUSPENSO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'EXPIRADO': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getTipoIcon = (tipo) => {
        switch (tipo) {
            case 'DINHEIRO':
                return <DollarSign className="w-5 h-5" />;
            case 'PRODUTO':
                return <Package className="w-5 h-5" />;
            case 'SERVICO':
                return <Award className="w-5 h-5" />;
            default:
                return <Gift className="w-5 h-5" />;
        }
    };

    // Funções para a tabela de produtores
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleStatusChange = (value) => {
        setPendingStatusValue(value);
        setShowStatusModal(true);
    };


    const confirmStatusChange = () => {
        const novoStatus = pendingStatusValue?.value || pendingStatusValue;
        const statusLabel = pendingStatusValue?.label || pendingStatusValue;

        try {
            const updatedData = { ...formData, status: novoStatus };
            setFormData(updatedData);

            if (!isEditing) {
                setIncentivo(updatedData);
            }

            showToast('success', `Status alterado para ${statusLabel} com sucesso!`);
        } catch (error) {
            showToast('error', 'Erro ao alterar status');
            console.error(error);
        } finally {
            setShowStatusModal(false);
            setPendingStatusValue(null);
        }
    };

    const sortedProdutores = React.useMemo(() => {
        let sortableItems = [...produtores];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [produtores, sortConfig]);

    const filteredProdutores = sortedProdutores.filter(produtor =>
        produtor.beneficiary_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produtor.beneficiary_id_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produtor.confirmar_telefone?.includes(searchTerm) ||
        produtor.provincia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produtor.municipio?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação
    const indexOfLastProdutor = currentPage * produtoresPerPage;
    const indexOfFirstProdutor = indexOfLastProdutor - produtoresPerPage;
    const currentProdutores = filteredProdutores.slice(indexOfFirstProdutor, indexOfLastProdutor);
    const totalPages = Math.ceil(filteredProdutores.length / produtoresPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getGenderIcon = (gender) => {
        return gender === 'm' ? '👨' : '👩';
    };


    const formatGender = (gender) => {
        return gender === 'm' ? 'Masculino' : 'Feminino';
    };

    const formatestado_civil = (estado) => {
        const estados = {
            'solteiro': 'Solteiro(a)',
            'casado': 'Casado(a)',
            'divorciado': 'Divorciado(a)',
            'viuvo': 'Viúvo(a)',
            'uniao_facto': 'União de Facto'
        };
        return estados[estado] || estado;
    };

    const formatnivel_escolaridade = (nivel) => {
        const niveis = {
            'superior': 'Ensino Superior',
            'secundario': 'Ensino Secundário',
            'primario': 'Ensino Primário',
            'pre_escolar': 'Pré-escolar',
            'nenhum': 'Nenhum'
        };
        return niveis[nivel] || nivel;
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Carregando dados do incentivo...</p>
                    <p className="text-sm text-gray-500">ID: {id}</p>
                </div>
            </div>
        );
    }

    // Incentivo não encontrado
    if (!incentivo) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Incentivo não encontrado</h1>
                    <p className="text-gray-600 mb-6">O incentivo com ID {id} não foi encontrado no sistema.</p>
                    <button
                        onClick={handleBack}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar à lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    toastMessage.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'info' && <Info className="w-5 h-5 mr-2" />}
                        <p>{toastMessage.message}</p>
                        <button
                            onClick={() => setToastMessage(null)}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            {/* Título e navegação */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleBack}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        {getTipoIcon(incentivo.tipoDoIncentivo)}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {isEditing ? 'Editando Incentivo' : 'Detalhes do Incentivo'}
                                        </h1>
                                        <p className="text-gray-600">ID: {incentivo.id} • {incentivo.tipoDoIncentivo}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                                        >
                                            {saving ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {saving ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleEditClick}
                                                className="flex items-center px-4 py-2 h-11 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => showToast('info', 'Função de relatório em desenvolvimento')}
                                                className="flex items-center px-4 py-2 h-11 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Relatório
                                            </button>
                                        </div>

                                        {/* Select de status */}
                                        <div className="min-w-[180px]">
                                            <CustomInput
                                                type="select"
                                                value={{ label: formData.status, value: formData.status }}
                                                options={statusOptions}
                                                onChange={handleStatusChange}
                                                placeholder="Estado"
                                                iconStart={<RefreshCw size={18} />}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(formData.status)}`}>
                                {formData.status === 'ACTIVO' && <CheckCircle className="w-4 h-4 mr-1" />}
                                {formData.status === 'INATIVO' && <X className="w-4 h-4 mr-1" />}
                                {formData.status === 'SUSPENSO' && <Clock className="w-4 h-4 mr-1" />}
                                {formData.status === 'EXPIRADO' && <AlertCircle className="w-4 h-4 mr-1" />}
                                {formData.status}
                            </span>

                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                                <Gift className="w-4 h-4 mr-1" />
                                Incentivo Registrado
                            </span>

                            {incentivo.dataDeVencimentoDoIncentivo && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-50 text-orange-700 border border-orange-200">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    Vence em: {formatDate(incentivo.dataDeVencimentoDoIncentivo)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Conteúdo principal com formulários */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* COLUNA ESQUERDA */}
                    <div className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Gift className="w-5 h-5 mr-2 text-blue-600" />
                                Informações Básicas
                            </h2>

                            <div className="space-y-4">
                                <CustomInput
                                    type="text"
                                    label="Nome do Incentivo"
                                    value={formData.nomeDoIncentivo}
                                    onChange={(value) => updateFormData('nomeDoIncentivo', value)}
                                    disabled={!isEditing}
                                    iconStart={<Gift size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Tipo do Incentivo"
                                    value={{ label: formData.tipoDoIncentivo, value: formData.tipoDoIncentivo }}
                                    options={tipoIncentivoOptions}
                                    onChange={(value) => updateFormData('tipoDoIncentivo', value?.value)}
                                    disabled={!isEditing}
                                    iconStart={getTipoIcon(formData.tipoDoIncentivo)}
                                />

                                <CustomInput
                                    type="textarea"
                                    label="Descrição do Incentivo"
                                    value={formData.descricaoDoIncentivo}
                                    onChange={(value) => updateFormData('descricaoDoIncentivo', value)}
                                    disabled={!isEditing}
                                    placeholder="Descreva o incentivo..."
                                    rows={4}
                                />

                                <CustomInput
                                    type="date"
                                    label="Data de Vencimento"
                                    value={formData.dataDeVencimentoDoIncentivo}
                                    onChange={(value) => updateFormData('dataDeVencimentoDoIncentivo', value)}
                                    disabled={!isEditing}
                                    iconStart={<Calendar size={18} />}
                                    helperText={`Vencimento: ${formatDate(formData.dataDeVencimentoDoIncentivo)}`}
                                />
                            </div>
                        </div>

                        {/* Valores e Quantidades */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Calculator className="w-5 h-5 mr-2 text-green-600" />
                                Valores e Quantidades
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    type="number"
                                    label="Valor por Produto (AOA)"
                                    value={formData.valorPorProduto}
                                    onChange={(value) => updateFormData('valorPorProduto', value)}
                                    disabled={!isEditing}
                                    min="0"
                                    step="0.01"
                                    iconStart={<DollarSign size={18} />}
                                    helperText={`Valor: ${formatCurrency(formData.valorPorProduto)}`}
                                />

                                <CustomInput
                                    type="number"
                                    label="Valor de Reembolso (AOA)"
                                    value={formData.valorDoReembolso}
                                    onChange={(value) => updateFormData('valorDoReembolso', value)}
                                    disabled={!isEditing}
                                    min="0"
                                    step="0.01"
                                    iconStart={<Percent size={18} />}
                                    helperText={`Reembolso: ${formatCurrency(formData.valorDoReembolso)}`}
                                />

                                <CustomInput
                                    type="number"
                                    label="Quantidade por Produto"
                                    value={formData.quantidadePorProduto}
                                    onChange={(value) => updateFormData('quantidadePorProduto', value)}
                                    disabled={!isEditing}
                                    min="0"
                                    iconStart={<Hash size={18} />}
                                />

                                <CustomInput
                                    type="number"
                                    label="Valor por Kg (AOA)"
                                    value={formData.valorPorKg}
                                    onChange={(value) => updateFormData('valorPorKg', value)}
                                    disabled={!isEditing}
                                    min="0"
                                    step="0.01"
                                    iconStart={<TrendingUp size={18} />}
                                    helperText={`Por Kg: ${formatCurrency(formData.valorPorKg)}`}
                                />
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                                Observações Adicionais
                            </h2>

                            <CustomInput
                                type="textarea"
                                label="Observações"
                                value={formData.observacoes}
                                onChange={(value) => updateFormData('observacoes', value)}
                                disabled={!isEditing}
                                placeholder="Observações sobre o incentivo..."
                                rows={5}
                            />
                        </div>
                    </div>

                    {/* COLUNA DIREITA */}
                    <div className="space-y-6">
                        {/* Produto/Serviço */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Package className="w-5 h-5 mr-2 text-orange-600" />
                                Produto/Serviço
                            </h2>

                            <div className="space-y-4">
                                <CustomInput
                                    type="text"
                                    label="Nome do Produto/Serviço"
                                    value={formData.nomeDoProduto}
                                    onChange={(value) => updateFormData('nomeDoProduto', value)}
                                    disabled={!isEditing}
                                    iconStart={<ShoppingCart size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Unidade de Medida"
                                    value={{ label: formData.unidade, value: formData.unidade }}
                                    options={unidadeOptions}
                                    onChange={(value) => updateFormData('unidade', value?.value)}
                                    disabled={!isEditing}
                                    iconStart={<Target size={18} />}
                                />
                            </div>

                            {formData.tipoDoIncentivo === 'PRODUTO' && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-800 mb-2">Resumo do Produto</h4>
                                    <div className="space-y-1 text-sm text-blue-700">
                                        <p><strong>Produto:</strong> {formData.nomeDoProduto || 'Não especificado'}</p>
                                        <p><strong>Quantidade:</strong> {formData.quantidadePorProduto} {formData.unidade}</p>
                                        <p><strong>Total:</strong> {formatCurrency(formData.valorPorProduto)}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Pagamento e Entrega */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                                Pagamento e Entrega
                            </h2>

                            <div className="space-y-4">
                                <CustomInput
                                    type="select"
                                    label="Forma de Pagamento"
                                    value={{ label: formData.formaDePagamento, value: formData.formaDePagamento }}
                                    options={formaPagamentoOptions}
                                    onChange={(value) => updateFormData('formaDePagamento', value?.value)}
                                    disabled={!isEditing}
                                    iconStart={<CreditCard size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Forma de Entrega"
                                    value={{ label: formData.formaDeEntrega, value: formData.formaDeEntrega }}
                                    options={formaEntregaOptions}
                                    onChange={(value) => updateFormData('formaDeEntrega', value?.value)}
                                    disabled={!isEditing}
                                    iconStart={<Truck size={18} />}
                                />
                            </div>

                            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                                <h4 className="font-semibold text-green-800 mb-2">Resumo do Pagamento</h4>
                                <div className="space-y-1 text-sm text-green-700">
                                    <p><strong>Forma de Pagamento:</strong> {formData.formaDePagamento || 'Não definido'}</p>
                                    <p><strong>Forma de Entrega:</strong> {formData.formaDeEntrega || 'Não definido'}</p>
                                    <p><strong>Total:</strong> {formatCurrency(formData.valorPorProduto)}</p>
                                    {formData.valorDoReembolso > 0 && (
                                        <p><strong>Reembolso:</strong> {formatCurrency(formData.valorDoReembolso)}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Métricas */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-purple-600" />
                                Métricas do Incentivo
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-blue-100 rounded-full">
                                            <DollarSign className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-blue-600">Total</p>
                                            <p className="text-lg font-bold text-blue-900">{formatCurrency(formData.valorPorProduto)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-green-100 rounded-full">
                                            <Hash className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-green-600">Quantidade</p>
                                            <p className="text-lg font-bold text-green-900">{formData.quantidadePorProduto}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-purple-100 rounded-full">
                                            <TrendingUp className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-purple-600">Valor/Kg</p>
                                            <p className="text-lg font-bold text-purple-900">{formatCurrency(formData.valorPorKg)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                                    <div className="flex items-center">
                                        <div className="p-2 bg-orange-100 rounded-full">
                                            <Percent className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-orange-600">Reembolso</p>
                                            <p className="text-lg font-bold text-orange-900">{formatCurrency(formData.valorDoReembolso)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TABELA DE PRODUTORES */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-blue-600" />
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Produtores Beneficiários</h2>
                                    <p className="text-sm text-gray-600">
                                        {filteredProdutores.length} produtor{filteredProdutores.length !== 1 ? 'es' : ''} encontrado{filteredProdutores.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        type="text"
                                        placeholder="Buscar produtores..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                                    />
                                </div>
                                <button
                                    onClick={fetchProdutores}
                                    disabled={loadingProdutores}
                                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                                >
                                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingProdutores ? 'animate-spin' : ''}`} />
                                    Actualizar
                                </button>
                            </div>
                        </div>

                        {loadingProdutores ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-600">Carregando produtores...</p>
                                </div>
                            </div>
                        ) : filteredProdutores.length === 0 ? (
                            <div className="text-center py-12">
                                <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produtor encontrado</h3>
                                <p className="text-gray-600">
                                    {searchTerm ? 'Tente ajustar os termos de busca.' : 'Ainda não há produtores registrados para este incentivo.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Tabela */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th
                                                    onClick={() => handleSort('id')}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        ID
                                                        {sortConfig.key === 'id' && (
                                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                        )}
                                                    </div>
                                                </th>
                                                <th
                                                    onClick={() => handleSort('beneficiary_name')}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Nome Completo
                                                        {sortConfig.key === 'nome_produtor' && (
                                                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                                                        )}
                                                    </div>
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Documento
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Telefone
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Localização
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Informações Pessoais
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acções
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {currentProdutores.map((produtor) => (
                                                <tr key={produtor.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        #{produtor.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace w-[420px]">
                                                        <div className="flex items-center">
                                                            <div className="h-20 w-20 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700">
                                                                {<ProdutorAvatar
                                                                    produtor={produtor}
                                                                    size="w-20 h-20"
                                                                    textSize="text-lg"
                                                                />}
                                                            </div>
                                                            <div className="flex-shrink-0 h-10 w-10">

                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900 ">
                                                                    {produtor.beneficiary_name || `${produtor.nomeProdutor} ${produtor.sobrenomeProdutor}`}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatGender(produtor.beneficiary_gender)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">{produtor.beneficiary_id_number}</div>
                                                        <div className="text-sm text-gray-500 capitalize">{produtor.tipoDocumento?.replace('_', ' ')}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                            {produtor.confirmar_telefone}
                                                        </div>
                                                        {produtor.telefone_proprio === 'sim' && (
                                                            <div className="text-xs text-green-600">✓ Próprio</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center text-sm text-gray-900">
                                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                            <div>
                                                                <div className="capitalize">{produtor.provincia}</div>
                                                                <div className="text-xs text-gray-500 capitalize">{produtor.municipio}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            <div className="flex items-center mb-1">
                                                                <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                                                                {formatDate(produtor.beneficiary_date_of_birth)}
                                                            </div>
                                                            <div className="flex items-center mb-1">
                                                                <BookOpen className="w-4 h-4 mr-2 text-gray-400" />
                                                                <span className="text-xs">{formatnivel_escolaridade(produtor.nivel_escolaridade)}</span>
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {formatestado_civil(produtor.estado_civil)}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${produtor.estado === 'Aprovado'
                                                            ? 'bg-green-100 text-green-800'
                                                            : produtor.estado === 'Pendente'
                                                                ? 'bg-yellow-100 text-yellow-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {produtor.estado}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <button
                                                            onClick={() => showToast('info', `Visualizar detalhes do produtor ${produtor.beneficiary_name}`)}
                                                            className="text-blue-600 hover:text-blue-900 flex items-center"
                                                        >
                                                            <Eye className="w-4 h-4 mr-1" />
                                                            Ver Detalhes
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginação */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
                                        <div className="flex flex-1 justify-between sm:hidden">
                                            <button
                                                onClick={() => paginate(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Anterior
                                            </button>
                                            <button
                                                onClick={() => paginate(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                Próximo
                                            </button>
                                        </div>
                                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Mostrando <span className="font-medium">{indexOfFirstProdutor + 1}</span> a{' '}
                                                    <span className="font-medium">
                                                        {Math.min(indexOfLastProdutor, filteredProdutores.length)}
                                                    </span>{' '}
                                                    de <span className="font-medium">{filteredProdutores.length}</span> resultados
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                    <button
                                                        onClick={() => paginate(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                        className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>

                                                    {Array.from({ length: totalPages }).map((_, index) => {
                                                        const pageNumber = index + 1;
                                                        const isCurrentPage = pageNumber === currentPage;

                                                        if (
                                                            pageNumber === 1 ||
                                                            pageNumber === totalPages ||
                                                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                                        ) {
                                                            return (
                                                                <button
                                                                    key={pageNumber}
                                                                    onClick={() => paginate(pageNumber)}
                                                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${isCurrentPage
                                                                        ? 'z-10 bg-blue-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                                                                        }`}
                                                                >
                                                                    {pageNumber}
                                                                </button>
                                                            );
                                                        } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                                                            return (
                                                                <span
                                                                    key={pageNumber}
                                                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                                                                >
                                                                    ...
                                                                </span>
                                                            );
                                                        }
                                                        return null;
                                                    })}

                                                    <button
                                                        onClick={() => paginate(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                        className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Informações do Sistema */}
                <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Info className="w-5 h-5 mr-2 text-gray-600" />
                        Informações do Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-gray-700">ID Sistema:</span>
                            <p className="text-gray-600">{incentivo.id}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Tipo:</span>
                            <p className="text-gray-600">{incentivo.tipoDoIncentivo}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Estado Atual:</span>
                            <p className="text-gray-600">{incentivo.status}</p>
                        </div>
                        <div>
                            <span className="font-medium text-gray-700">Última Actualização:</span>
                            <p className="text-gray-600">{formatDate(new Date())}</p>
                        </div>
                    </div>
                </div>
            </div>

            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                            <RefreshCw className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Alteração de Estado</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">
                            Deseja alterar o status para: <br />
                            <span className="font-bold text-blue-600">{pendingStatusValue?.label || pendingStatusValue?.value}</span>?
                        </p>
                        <div className="flex gap-3 mt-2 w-full">
                            <button
                                onClick={confirmStatusChange}
                                className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                            >
                                Sim, alterar
                            </button>
                            <button
                                onClick={() => { setShowStatusModal(false); setPendingStatusValue(null); }}
                                className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cancelamento */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Cancelamento</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">
                            Tem certeza que deseja cancelar? <br />Os dados não salvos serão perdidos.
                        </p>
                        <div className="flex gap-3 mt-2 w-full">
                            <button
                                onClick={confirmCancelEdit}
                                className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Sim, cancelar
                            </button>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisualizarIncentivo;