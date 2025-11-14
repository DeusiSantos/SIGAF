import {
    AlertCircle,
    AlertTriangle,
    Building,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileText,
    Filter,
    ImageIcon,
    Leaf,
    MapPin,
    MoreVertical,
    Search,
    Shield,
    Tractor,
    Trash2,
    TreePine,
    Truck,
    X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../../core/components/CustomInput';
import api from '../../../../../core/services/api';
import { useProdutores, useProdutoresAprovados } from '../../../../hooks/useRnpaData';

// Componente para Avatar do Produtor com foto da API
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
                    `http://mwangobrainsa-001-site2.mtempurl.com/api/formulario/${produtor.id}/foto-beneficiary`,
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

// Função para mapear os dados da API para o formato esperado pelo componente florestal
const mapApiDataToProdutorFlorestal = (apiData) => {
    if (!apiData || !Array.isArray(apiData)) return [];

    return apiData.map((item) => {
        // Mapear espécies florestais
        const mapEspecies = (especiesString) => {
            if (!especiesString) return ['Eucalipto', 'Pinus'];
            return especiesString.split(',').map(e => e.trim()).slice(0, 3);
        };

        // Determinar status florestal
        const getStatusFlorestal = (item) => {
            const licencaStatus = item.licenca_estado || 'Pendente';
            const fiscalizacaoStatus = item.fiscalizacao_resultado || 'Conforme';
            const penalidades = item.penalidades_status || 'Sem penalidades';

            if (licencaStatus === 'Aprovada' && fiscalizacaoStatus === 'Conforme' && penalidades === 'Sem penalidades') {
                return 'LICENÇA_APROVADA';
            }
            if (fiscalizacaoStatus === 'Conforme') return 'INSPEÇÃO_CONFORME';
            if (penalidades !== 'Sem penalidades') return 'PENALIDADE_PENDENTE';
            return 'PENDENTE';
        };

        // Extrair coordenadas GPS resumidas
        const getGPSResumo = (gpsString) => {
            if (!gpsString) return 'N/A';
            const coords = gpsString.split(' ');
            const lat = parseFloat(coords[0]) || 0;
            const lng = parseFloat(coords[1]) || 0;
            return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
        };

        return {
            id: item._id?.toString(),
            codigoSIGAF: `RNPF${new Date(item.registration_date || '2025-01-01').getFullYear()}${item._id?.toString().slice(-3)}`,
            nome: item.beneficiary_name || `${item.nome_produtor || ''} ${item.nome_meio_produtor || ''} ${item.sobrenome_produtor || ''}`.trim(),
            numeroBI: item.beneficiary_id_number || 'N/A',
            telefone: item.beneficiary_phone_number || 'N/A',
            provincia: item.provincia?.toUpperCase() || 'N/A',
            municipio: item.municipio || 'N/A',
            coordenadasGPS: getGPSResumo(item.gps_coordinates),

            // Dados florestais específicos
            propriedade: {
                tipo: item.propriedade_tipo || 'Privada',
                nome: item.propriedade_nome || 'Área Florestal'
            },
            especiesPredominantes: mapEspecies(item.especies_florestais),
            volumeEstimado: parseFloat(item.volume_estimado) || Math.floor(Math.random() * 500) + 100,

            licenciamento: {
                tipo: item.licenca_tipo || 'Corte',
                status: item.licenca_estado || 'Pendente'
            },
            fiscalizacao: {
                resultado: item.fiscalizacao_resultado || 'Conforme',
                auto: item.fiscalizacao_auto || 'N/A'
            },
            penalidades: {
                infracao: item.penalidades_infracao || 'Nenhuma',
                valor: parseFloat(item.penalidades_valor) || 0,
                status: item.penalidades_status || 'Sem penalidades'
            },
            transporte: {
                destino: item.transporte_destino || 'N/A',
                placa: item.transporte_placa || 'N/A'
            },

            statusProcesso: getStatusFlorestal(item),
            dataSubmissao: item.registration_date || item._submission_time?.split('T')[0]
        };
    });
};

const ProdutoresGestao = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 4;
    const containerRef = useRef(null);
    const { produtor, loading: loadingProdutor } = useProdutores();
    const { produtor: produtoresAprovados, loading: loadingAprovados } = useProdutoresAprovados();

    // Transformar dados da API para o formato florestal esperado
    const produtores = useMemo(() => {
        const todosProdutores = [];

        // Adicionar produtores regulares
        if (produtor && Array.isArray(produtor)) {
            todosProdutores.push(...mapApiDataToProdutorFlorestal(produtor));
        }

        // Adicionar produtores aprovados
        if (produtoresAprovados && Array.isArray(produtoresAprovados)) {
            todosProdutores.push(...mapApiDataToProdutorFlorestal(produtoresAprovados));
        }

        return todosProdutores;
    }, [produtor, produtoresAprovados]);

    const [localProdutores, setLocalProdutores] = useState([]);

    // Dados fictícios para demonstração
    const dadosFicticios = [
        {
            id: '1',
            codigoSIGAF: 'RNPF2025001',
            nome: 'João Manuel Silva',
            numeroBI: '004567890LA041',
            telefone: '+244 923 456 789',
            provincia: 'LUANDA',
            municipio: 'Belas',
            coordenadasGPS: '-8.956, 13.234',
            propriedade: { tipo: 'Privada', nome: 'Fazenda Eucalipto Verde' },
            especiesPredominantes: ['Eucalipto', 'Pinus', 'Acácia'],
            volumeEstimado: 450,
            licenciamento: { tipo: 'Corte', status: 'Aprovada' },
            fiscalizacao: { resultado: 'Conforme', auto: 'AUTO-2025-001' },
            penalidades: { infracao: 'Nenhuma', valor: 0, status: 'Sem penalidades' },
            transporte: { destino: 'Luanda', placa: 'LD-45-67-AB' },
            statusProcesso: 'LICENÇA_APROVADA',
            dataSubmissao: '2025-01-15'
        },
        {
            id: '2',
            codigoSIGAF: 'RNPF2025002',
            nome: 'Maria Fernanda Costa',
            numeroBI: '005678901LA042',
            telefone: '+244 924 567 890',
            provincia: 'BENGUELA',
            municipio: 'Lobito',
            coordenadasGPS: '-12.345, 13.567',
            propriedade: { tipo: 'Pública', nome: 'Área Florestal Estatal' },
            especiesPredominantes: ['Pinus', 'Cedro'],
            volumeEstimado: 320,
            licenciamento: { tipo: 'Transporte', status: 'Pendente' },
            fiscalizacao: { resultado: 'Conforme', auto: 'N/A' },
            penalidades: { infracao: 'Nenhuma', valor: 0, status: 'Sem penalidades' },
            transporte: { destino: 'N/A', placa: 'N/A' },
            statusProcesso: 'PENDENTE',
            dataSubmissao: '2025-01-10'
        },
        {
            id: '3',
            codigoSIGAF: 'RNPF2025003',
            nome: 'António Carlos Mendes',
            numeroBI: '006789012LA043',
            telefone: '+244 925 678 901',
            provincia: 'HUÍLA',
            municipio: 'Lubango',
            coordenadasGPS: '-14.789, 13.890',
            propriedade: { tipo: 'Privada', nome: 'Plantação Serra da Leba' },
            especiesPredominantes: ['Eucalipto', 'Jacarandá', 'Mogno', 'Teca'],
            volumeEstimado: 680,
            licenciamento: { tipo: 'Corte', status: 'Aprovada' },
            fiscalizacao: { resultado: 'Conforme', auto: 'AUTO-2025-002' },
            penalidades: { infracao: 'Nenhuma', valor: 0, status: 'Sem penalidades' },
            transporte: { destino: 'Benguela', placa: 'HU-78-90-CD' },
            statusProcesso: 'INSPEÇÃO_CONFORME',
            dataSubmissao: '2025-01-08'
        },
        {
            id: '4',
            codigoSIGAF: 'RNPF2025004',
            nome: 'Isabel Rodrigues Santos',
            numeroBI: '007890123LA044',
            telefone: '+244 926 789 012',
            provincia: 'MALANJE',
            municipio: 'Malanje',
            coordenadasGPS: '-9.123, 16.456',
            propriedade: { tipo: 'Privada', nome: 'Floresta Malanje' },
            especiesPredominantes: ['Pinus', 'Eucalipto'],
            volumeEstimado: 280,
            licenciamento: { tipo: 'Carvão', status: 'Negada' },
            fiscalizacao: { resultado: 'Não Conforme', auto: 'AUTO-2025-003' },
            penalidades: { infracao: 'Corte irregular', valor: 150000, status: 'Pendente' },
            transporte: { destino: 'N/A', placa: 'N/A' },
            statusProcesso: 'PENALIDADE_PENDENTE',
            dataSubmissao: '2025-01-05'
        },
        {
            id: '5',
            codigoSIGAF: 'RNPF2025005',
            nome: 'Pedro Miguel Fernandes',
            numeroBI: '008901234LA045',
            telefone: '+244 927 890 123',
            provincia: 'CUANZA SUL',
            municipio: 'Sumbe',
            coordenadasGPS: '-11.234, 13.789',
            propriedade: { tipo: 'Pública', nome: 'Reserva Florestal Sumbe' },
            especiesPredominantes: ['PFNM', 'Baobá'],
            volumeEstimado: 120,
            licenciamento: { tipo: 'PFNM', status: 'Aprovada' },
            fiscalizacao: { resultado: 'Conforme', auto: 'AUTO-2025-004' },
            penalidades: { infracao: 'Nenhuma', valor: 0, status: 'Sem penalidades' },
            transporte: { destino: 'Luanda', placa: 'CS-12-34-EF' },
            statusProcesso: 'LICENÇA_APROVADA',
            dataSubmissao: '2025-01-12'
        }
    ];

    // Atualizar produtores locais quando os dados da API mudarem ou usar dados fictícios
    useEffect(() => {
        if (produtores.length > 0) {
            setLocalProdutores(produtores);
        } else {
            // Usar dados fictícios quando não há dados da API
            setLocalProdutores(dadosFicticios);
        }
    }, [produtores]);

    // Mostrar toast de informação sobre dados fictícios
    useEffect(() => {
        if (!loadingProdutor && !loadingAprovados && (!produtor || produtor.length === 0) && (!produtoresAprovados || produtoresAprovados.length === 0)) {
            showToast('info', 'Dados Fictícios', 'Exibindo dados de demonstração para visualização da tabela');
        }
    }, [loadingProdutor, loadingAprovados, produtor, produtoresAprovados]);

    console.log('Produtores da API:', produtor);
    console.log('Produtores Aprovados da API:', produtoresAprovados);
    console.log('Produtores mapeados (todos):', produtores);
    console.log('Produtores locais (incluindo fictícios):', localProdutores);

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

    // Navegação para diferentes telas
    const handleViewProdutor = (produtorId) => {
        navigate(`/GerenciaSIGAF/gestao-florestal/visualizarprodutorflorestal/${produtorId}`);
    };

    const handleHistoricoProducao = (produtorId) => {
        navigate(`/GerenciaSIGAF/produtores/historico-producao/${produtorId}`);
    };

    {/*const handleHistoricoBeneficios = (produtorId) => {
        navigate(`/GerenciaSIGAF/produtores/historico-beneficios/${produtorId}`);
    };*/}

    const handleGerarCartao = (produtorId) => {
        navigate(`/GerenciaSIGAF/gestao-escolar/produtores/gerar-cartao/${produtorId}`);
    };

    {/*const handleCadastroProdutor = () => {
        navigate('/GerenciaSIGAF/produtores/cadastrar');
    };*/}

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [produtorToDelete, setProdutorToDelete] = useState(null);

    const openDeleteModal = (produtorId) => {
        setProdutorToDelete(produtorId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setProdutorToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (!produtorToDelete) return;
        try {
            await api.delete(`/formulario/${produtorToDelete}`);
            setLocalProdutores(prevProdutores =>
                prevProdutores.filter(produtor => produtor.id !== produtorToDelete)
            );
            showToast('success', 'Sucesso', 'Produtor removido com sucesso');
        } catch (error) {
            console.error("Erro ao excluir produtor:", error);
            showToast('error', 'Erro', 'Falha ao remover o produtor');
        } finally {
            closeDeleteModal();
        }
    };

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const produtor = localProdutores.find(p => p.id === produtorToDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o produtor <span className="font-semibold text-red-600">{produtor?.nome || 'Selecionado'}</span>?<br />
                        Esta ação não pode ser desfeita. Todos os dados do produtor serão removidos permanentemente.
                    </p>
                    <div className="flex gap-3 mt-2 w-full">
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 p-2 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Sim, excluir
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // Alterar status do processo
    const handleChangeStatus = (produtorId, newStatus) => {
        setLocalProdutores(prevProdutores =>
            prevProdutores.map(produtor =>
                produtor.id === produtorId ? { ...produtor, statusProcesso: newStatus } : produtor
            )
        );

        const statusLabels = {
            'LICENÇA_APROVADA': 'Licença Aprovada',
            'INSPEÇÃO_CONFORME': 'Inspeção Conforme',
            'PENALIDADE_PENDENTE': 'Penalidade Pendente',
            'PENDENTE': 'Pendente'
        };

        showToast('success', 'Status Atualizado', `Status alterado para: ${statusLabels[newStatus]}`);
    };

    // Filtragem dos produtores florestais
    const filteredProdutores = localProdutores.filter(produtor => {
        const matchesSearch = produtor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produtor.numeroBI.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produtor.codigoSIGAF.toLowerCase().includes(searchTerm.toLowerCase()) ||
            produtor.propriedade?.nome.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || produtor.statusProcesso === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredProdutores.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProdutores.slice(startIndex, endIndex);
    };

    // Ações do menu dropdown
    const getActionItems = (produtor) => {
        const baseActions = [
            { label: 'Histórico de Produção', icon: <Tractor size={16} />, action: handleHistoricoProducao },
            // { label: 'Histórico de Benefícios', icon: <Gift size={16} />, action: handleHistoricoBeneficios }
        ];

        // Adicionar "Gerar Cartão SIGAF" apenas para produtores aprovados
        if (produtor.statusProcesso === 'APROVADO') {
            // baseActions.push({ label: 'Gerar Cartão SIGAF', icon: <CreditCard size={16} />, action: handleGerarCartao });
        }

        return baseActions;
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Calcular idade
    const calculateAge = (dateString) => {
        if (!dateString) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} anos`;
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

    // Menu dropdown de ações
    const ActionMenu = ({ produtor }) => {
        const [isOpen, setIsOpen] = useState(false);
        const actionItems = getActionItems(produtor);

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Mais ações"
                >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-[999] ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {actionItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                        item.action(produtor.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="mr-2 text-blue-500">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Menu dropdown para mudança de status
    const StatusMenu = ({ produtor }) => {
        const [isOpen, setIsOpen] = useState(false);

        const statusOptions = [
            { label: 'Licença Aprovada', value: 'LICENÇA_APROVADA', color: 'text-green-600' },
            { label: 'Inspeção Conforme', value: 'INSPEÇÃO_CONFORME', color: 'text-blue-600' },
            { label: 'Penalidade Pendente', value: 'PENALIDADE_PENDENTE', color: 'text-red-600' },
            { label: 'Pendente', value: 'PENDENTE', color: 'text-yellow-600' }
        ];

        const currentStatus = statusOptions.find(s => s.value === produtor.statusProcesso);

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${getStatusColor(produtor.statusProcesso)} hover:opacity-80`}
                >
                    {currentStatus?.label || produtor.statusProcesso}
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {statusOptions.map((status, index) => (
                                <button
                                    key={index}
                                    className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${status.color}`}
                                    onClick={() => {
                                        handleChangeStatus(produtor.id, status.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Cores para diferentes status florestais
    const getStatusColor = (status) => {
        const statusColors = {
            'LICENÇA_APROVADA': 'bg-green-100 text-green-800 border-green-300',
            'INSPEÇÃO_CONFORME': 'bg-blue-100 text-blue-800 border-blue-300',
            'PENALIDADE_PENDENTE': 'bg-red-100 text-red-800 border-red-300',
            'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Indicadores de totais florestais
    const totalProdutores = localProdutores.length;
    const totalLicencasAprovadas = localProdutores.filter(p => p.statusProcesso === 'LICENÇA_APROVADA').length;
    const totalInspecoesConformes = localProdutores.filter(p => p.statusProcesso === 'INSPEÇÃO_CONFORME').length;
    const totalPenalidadesPendentes = localProdutores.filter(p => p.statusProcesso === 'PENALIDADE_PENDENTE').length;
    const totalPendentes = localProdutores.filter(p => p.statusProcesso === 'PENDENTE').length;

    return (
        <div>
            {/* Indicadores do topo */}
            <div className="w-full flex justify-center bg-transparent pb-[30px] pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <TreePine className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{totalProdutores}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Shield className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Licenças</p>
                                <p className="text-2xl font-bold text-gray-900">{totalLicencasAprovadas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Conformes</p>
                                <p className="text-2xl font-bold text-gray-900">{totalInspecoesConformes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Penalidades</p>
                                <p className="text-2xl font-bold text-gray-900">{totalPenalidadesPendentes}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Pendentes</p>
                                <p className="text-2xl font-bold text-gray-900">{totalPendentes}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-xl  overflow-hidden" ref={containerRef}>

                <Toast />

                {/* Cabeçalho */}
                <div className="bg-gradient-to-r  from-blue-700 to-blue-500 p-6 text-white shadow-md mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Produtores Florestais</h1>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados dos produtores')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-xl shadow-md overflow-auto" style={{ maxHeight: contentHeight }}>

                    {/* Barra de ferramentas */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Busca */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="text"
                                    placeholder="Pesquisar por nome, BI, código RNPF ou propriedade..."
                                    value={searchTerm}
                                    onChange={(value) => setSearchTerm(value)}
                                    iconStart={<Search size={18} />}
                                />
                            </div>

                            {/* Filtro Status */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Estado do Processo"
                                    value={selectedStatus ? { label: selectedStatus, value: selectedStatus } : null}
                                    options={[
                                        { label: 'Todos os Estados', value: '' },
                                        { label: 'Licença Aprovada', value: 'LICENÇA_APROVADA' },
                                        { label: 'Inspeção Conforme', value: 'INSPEÇÃO_CONFORME' },
                                        { label: 'Penalidade Pendente', value: 'PENALIDADE_PENDENTE' },
                                        { label: 'Pendente', value: 'PENDENTE' }
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
                                    value=""
                                    options={[
                                        { label: 'Todos os Tipos', value: '' },
                                        { label: 'Corte', value: 'CORTE' },
                                        { label: 'Transporte', value: 'TRANSPORTE' },
                                        { label: 'Carvão', value: 'CARVAO' },
                                        { label: 'PFNM', value: 'PFNM' }
                                    ]}
                                    onChange={() => { }}
                                    iconStart={<TreePine size={18} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabela - Desktop */}
                    <div className="hidden md:block overflow-visible" style={{ maxHeight: contentHeight }}>
                        {loadingProdutor || loadingAprovados ? (
                            <div className="flex items-center justify-start py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Carregando produtores...</span>
                            </div>
                        ) : (
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Produtor
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Propriedade & Espécies
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Licenciamento & Fiscalização
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                            Volume & Transporte
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
                                    {getCurrentItems().map((produtor) => (
                                        <tr key={produtor.id} className="hover:bg-blue-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-start text-start">
                                                    <ProdutorAvatar
                                                        produtor={produtor}
                                                        size="w-16 h-16"
                                                        textSize="text-sm"
                                                    />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-semibold text-gray-900 max-w-[200px]">{produtor.nome}</div>
                                                        <div className="text-xs text-gray-500 mt-1">Código: {produtor.codigoSIGAF}</div>
                                                        <div className="text-xs text-gray-500">BI: {produtor.numeroBI}</div>
                                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            {produtor.coordenadasGPS}
                                                        </div>
                                                        <div className="text-xs text-gray-600">{produtor.municipio}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col items-start space-y-2">
                                                    <div className="flex items-center text-xs">
                                                        <Building className="w-3 h-3 mr-1 text-blue-500" />
                                                        <span className="font-medium">{produtor.propriedade.tipo}:</span>
                                                        <span className="ml-1 text-gray-600">{produtor.propriedade.nome}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1">
                                                        {produtor.especiesPredominantes.slice(0, 2).map((especie, index) => (
                                                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                <Leaf className="w-3 h-3 mr-1" />
                                                                {especie}
                                                            </span>
                                                        ))}
                                                        {produtor.especiesPredominantes.length > 2 && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                                +{produtor.especiesPredominantes.length - 2}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col items-start space-y-2">
                                                    <div className="flex items-center text-xs">
                                                        <FileText className="w-3 h-3 mr-1 text-blue-500" />
                                                        <span className="font-medium">{produtor.licenciamento.tipo}:</span>
                                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs ${produtor.licenciamento.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                                                            produtor.licenciamento.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                            {produtor.licenciamento.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-xs">
                                                        <Shield className="w-3 h-3 mr-1 text-green-500" />
                                                        <span className="font-medium">Fiscalização:</span>
                                                        <span className={`ml-1 px-2 py-0.5 rounded text-xs ${produtor.fiscalizacao.resultado === 'Conforme' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                            }`}>
                                                            {produtor.fiscalizacao.resultado}
                                                        </span>
                                                    </div>
                                                    {produtor.penalidades.infracao !== 'Nenhuma' && (
                                                        <div className="flex items-center text-xs text-red-600">
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            <span>{produtor.penalidades.infracao}</span>
                                                            {produtor.penalidades.valor > 0 && (
                                                                <span className="ml-1">({produtor.penalidades.valor} Kz)</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col items-start space-y-2">
                                                    <div className="flex items-center text-xs">
                                                        <TreePine className="w-3 h-3 mr-1 text-green-500" />
                                                        <span className="font-medium">{produtor.volumeEstimado} m³</span>
                                                    </div>
                                                    {produtor.transporte.destino !== 'N/A' && (
                                                        <div className="flex items-center text-xs text-gray-600">
                                                            <Truck className="w-3 h-3 mr-1 text-blue-500" />
                                                            <span>{produtor.transporte.destino}</span>
                                                        </div>
                                                    )}
                                                    {produtor.transporte.placa !== 'N/A' && (
                                                        <div className="text-xs text-gray-500">
                                                            Placa: {produtor.transporte.placa}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center">
                                                    <StatusMenu produtor={produtor} />
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center justify-center space-x-1">
                                                    <button
                                                        onClick={() => handleViewProdutor(produtor.id)}
                                                        className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                        title="Visualizar"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(produtor.id)}
                                                        className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                    <ActionMenu produtor={produtor} />
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
                        {loadingProdutor || loadingAprovados ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">Carregando produtores florestais...</span>
                            </div>
                        ) : (
                            getCurrentItems().map((produtor) => (
                                <div key={produtor.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <div className="flex items-start">
                                        <ProdutorAvatar
                                            produtor={produtor}
                                            size="w-14 h-14"
                                            textSize="text-sm"
                                        />
                                        <div className="flex-1 ml-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{produtor.nome}</h3>
                                                    <div className="text-xs text-gray-500 mt-1">Código: {produtor.codigoSIGAF}</div>
                                                    <div className="text-xs text-gray-500">GPS: {produtor.coordenadasGPS}</div>
                                                </div>
                                                <StatusMenu produtor={produtor} />
                                            </div>

                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center text-xs">
                                                    <Building className="w-3 h-3 mr-1 text-blue-500" />
                                                    <span className="font-medium">{produtor.propriedade.tipo}:</span>
                                                    <span className="ml-1 text-gray-600">{produtor.propriedade.nome}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {produtor.especiesPredominantes.slice(0, 2).map((especie, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <Leaf className="w-3 h-3 mr-1" />
                                                            {especie}
                                                        </span>
                                                    ))}
                                                    {produtor.especiesPredominantes.length > 2 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +{produtor.especiesPredominantes.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <TreePine className="w-3 h-3 mr-1 text-green-500" />
                                                    <span className="font-medium">{produtor.volumeEstimado} m³</span>
                                                    <span className="ml-2 text-gray-500">|</span>
                                                    <FileText className="w-3 h-3 ml-2 mr-1 text-blue-500" />
                                                    <span className={`px-2 py-0.5 rounded text-xs ${produtor.licenciamento.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                                                        produtor.licenciamento.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                        {produtor.licenciamento.status}
                                                    </span>
                                                </div>
                                                {produtor.transporte.destino !== 'N/A' && (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Truck className="w-3 h-3 mr-1 text-blue-500" />
                                                        <span>{produtor.transporte.destino}</span>
                                                        {produtor.transporte.placa !== 'N/A' && (
                                                            <span className="ml-2">({produtor.transporte.placa})</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => handleViewProdutor(produtor.id)}
                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                        title="Visualizar"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(produtor.id)}
                                                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <ActionMenu produtor={produtor} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Paginação */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                            <div className="text-sm text-gray-700">
                                Mostrando{' '}
                                <span className="font-medium">{filteredProdutores.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                {' '}a{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * itemsPerPage, filteredProdutores.length)}
                                </span>
                                {' '}de{' '}
                                <span className="font-medium">{filteredProdutores.length}</span>
                                {' '}resultados
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                        ${currentPage === 1
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                                        }`}
                                >
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Anterior
                                </button>

                                {/* Números das páginas */}
                                <div className="flex space-x-1">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                        ${currentPage === totalPages || totalPages === 0
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                                        }`}
                                >
                                    Próximo
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Nenhum resultado encontrado */}
                    {!loadingProdutor && !loadingAprovados && filteredProdutores.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <Search className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {localProdutores.length === 0 ? 'Nenhum produtor florestal registado' : 'Nenhum produtor florestal encontrado'}
                            </h3>
                            <p className="text-gray-500 max-w-md mb-6">
                                {localProdutores.length === 0
                                    ? 'Ainda não há produtores florestais registados no sistema. Comece a adicionar um novo produtor florestal.'
                                    : 'Não encontramos resultados para a sua busca. Tente outros termos ou remova os filtros aplicados.'
                                }
                            </p>
                            {searchTerm || selectedStatus ? (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedStatus('');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            ) : (
                                <p />
                            )}
                        </div>
                    )}
                </div>
                <DeleteConfirmModal />
            </div>
        </div>
    );
};

export default ProdutoresGestao;