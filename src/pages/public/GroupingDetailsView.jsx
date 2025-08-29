import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAdministracoes, useGroupings, useProvincia, useScout } from '../../hooks/useScoutData';
import api from '../../services/api';
import { Activity, AlertTriangle, Award, Eye, FileText, Filter, Globe, MoreVertical, Pencil, Search, Share2, Trash2 } from 'lucide-react';
import CustomInput from '../../components/CustomInput';

const GroupingDetailsView = () => {
    const [activeSection, setActiveSection] = useState('info');
    const { id } = useParams();
    const navigate = useNavigate();

    // Data hooks
    const { groupings, loading } = useGroupings();
    const { administracoes, loading: loadingAdministracoes } = useAdministracoes();
    const { provincia, loading: loadingProvincia } = useProvincia();
    const { scout, loading: loadingScout, mutate } = useScout();
    const [escuteirosPorAgrupamento, setEscuteirosPorAgrupamento] = useState([]);



    // Estados para a tabela de escuteiros
    const [searchScoutTerm, setSearchScoutTerm] = useState('');
    const [selectedScoutCategory, setSelectedScoutCategory] = useState('');
    const [currentScoutPage, setCurrentScoutPage] = useState(1);
    const [scoutImageErrors, setScoutImageErrors] = useState({});
    const [toastScoutMessage, setToastScoutMessage] = useState(null);
    const [toastScoutTimeout, setToastScoutTimeout] = useState(null);
    const scoutsPerPage = 8;

    // API base URL
    const API_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';

    const fetchEscuteirosPorAgrupamento = useCallback(async () => {
        try {
            const response = await api.get(`/escuteiro/agrupamentos/${id}`);
            setEscuteirosPorAgrupamento(response.data);
        } catch (error) {
            console.error("Erro ao carregar escuteiros:", error);
            showToast("error", "Erro", "Não foi possível carregar os escuteiros por agrupamento");
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchEscuteirosPorAgrupamento();
        }
    }, [id, fetchEscuteirosPorAgrupamento]);

    // Limpar timeout ao desmontar o componente
    useEffect(() => {
        return () => {
            if (toastScoutTimeout) {
                clearTimeout(toastScoutTimeout);
            }
        };
    }, [toastScoutTimeout]);

    // Find the specific grouping
    const groupingDetails = useMemo(() => {
        return groupings?.find(g => g.id.toString() === id);
    }, [groupings, id]);

    // Administração Regional associada ao grouping
    const admRegional = useMemo(() => {
        if (!groupingDetails?.adminRegionalId || !administracoes?.length) return null;
        return administracoes.find(a => a.id === groupingDetails.adminRegionalId);
    }, [groupingDetails, administracoes]);

    // Buscar a província associada à administração regional
    const provinciaAdminRegional = useMemo(() => {
        if (!admRegional?.provinciaId || !provincia) return null;
        return provincia.find(p => p.id === admRegional.provinciaId);
    }, [admRegional, provincia]);

    // Calculate scout statistics for the current grouping
    const scoutStats = useMemo(() => {
        if (!scout || !id) return {
            total: 0,
            ativos: 0,
            inativos: 0,
            categorias: {
                lobitos: 0,
                juniors: 0,
                seniors: 0,
                caminheiros: 0,
                dirigentes: 0
            }
        };

        // Filtrar apenas os escuteiros deste agrupamento
        const groupingScouts = scout.filter(s => s.agrupamento_id?.toString() === id || s.agrupamentoId?.toString() === id);

        // Contar ativos e inativos
        const ativos = groupingScouts.filter(s => s.status === "Ativo" || s.estado === "Ativo").length;
        const inativos = groupingScouts.filter(s => s.status !== "Ativo" && s.estado !== "Ativo").length;
        const total = groupingScouts.length;

        // Contar escuteiros por categoria
        const categorias = groupingScouts.reduce((acc, scout) => {
            const categoria = (scout.categoria || '').toLowerCase().trim();
            if (categoria.includes('lobito')) {
                acc.lobitos++;
            } else if (categoria.includes('junior')) {
                acc.juniors++;
            } else if (categoria.includes('senior')) {
                acc.seniors++;
            } else if (categoria.includes('caminheiro')) {
                acc.caminheiros++;
            } else if (categoria.includes('dirigente')) {
                acc.dirigentes++;
            }
            return acc;
        }, {
            lobitos: 0,
            juniors: 0,
            seniors: 0,
            caminheiros: 0,
            dirigentes: 0
        });

        return { total, ativos, inativos, categorias };
    }, [scout, id]);

    // Função para obter a URL da imagem do escuteiro
    const getScoutImageUrl = (escuteiroId) => {
        if (!escuteiroId || scoutImageErrors[escuteiroId]) return '/assets/placeholder-profile.png';
        return `${API_URL}/escuteiro/${escuteiroId}/imagem`;
    };

    // Filtrar escuteiros por agrupamento e critérios de busca
    const groupingScouts = useMemo(() => {
        return scout?.filter(s =>
            s.agrupamento_id?.toString() === id ||
            s.agrupamentoId?.toString() === id
        ) || [];
    }, [scout, id]);

    // Extrair categorias únicas para o filtro
    const uniqueScoutCategories = useMemo(() => {
        return [...new Set(groupingScouts.map(s => s.categoria))].filter(Boolean);
    }, [groupingScouts]);


    // Paginação
    const totalScoutPages = Math.ceil(escuteirosPorAgrupamento.length / scoutsPerPage);

    // Exibir mensagem toast
    const showScoutToast = (type, title, message, duration = 5000) => {
        if (toastScoutTimeout) {
            clearTimeout(toastScoutTimeout);
        }

        setToastScoutMessage({ type, title, message });

        const timeout = setTimeout(() => {
            setToastScoutMessage(null);
        }, duration);

        setToastScoutTimeout(timeout);
    };

    // Alternar status do escuteiro (Ativo/Inativo)
    const toggleScoutStatus = async (escuteiroId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';

            // Atualizando UI imediatamente para melhor experiência
            const updatedScouts = scout.map(s =>
                s.id === escuteiroId ? { ...s, estado: newStatus, status: newStatus } : s
            );
            mutate(updatedScouts, false);

            // Chamada à API
            await api.patch(`escuteiro/estado/${escuteiroId}`, {
                estado: newStatus
            });

            // Revalidar dados após atualização bem-sucedida
            mutate();

            showScoutToast(
                'success',
                'Status Atualizado',
                `Escuteiro ${newStatus === 'Ativo' ? 'ativado' : 'desativado'} com sucesso`
            );
        } catch (error) {
            console.error('Erro ao atualizar o status:', error);

            // Reverter atualização otimista
            mutate(scout, false);

            showScoutToast(
                'error',
                'Erro',
                'Não foi possível alterar o status. Tente novamente.'
            );
        }
    };

    // Remover escuteiro
    const handleDeleteGroupingScout = (scoutId) => {
        // Confirmar exclusão
        if (window.confirm("Tem certeza que deseja excluir este escuteiro? Esta ação não pode ser desfeita.")) {
            // Mostrar toast informativo enquanto a feature está em desenvolvimento
            showScoutToast('info', 'Em desenvolvimento', 'A funcionalidade de exclusão está em desenvolvimento');
        }
    };

    // Menu dropdown para ações adicionais
    const ScoutActionMenu = ({ scout }) => {
        const [isOpen, setIsOpen] = useState(false);

        // Ações para o menu dropdown
        const actionItems = [
            {
                label: 'Transferência',
                icon: <Share2 size={16} />,
                action: (id) => navigate(`/escuteiros/transferir/${id}`)
            },
            {
                label: 'Progresso',
                icon: <Activity size={16} />,
                action: (id) => navigate(`/escuteiros/gestao/escuteiro/progresso/${id}`)
            },
            {
                label: 'Passe',
                icon: <FileText size={16} />,
                action: (id) => navigate(`/escuteiros/gestao/escuteiro/pass/${id}`)
            },
            {
                label: 'Disciplinar',
                icon: <AlertTriangle size={16} />,
                action: (id) => navigate(`/escuteiros/gestao/escuteiro/disciplinar/${id}`)
            },
            {
                label: 'Carta Internacional',
                icon: <Globe size={16} />,
                action: (id) => navigate(`/escuteiros/gestao/escuteiro/cartaInternacional/${id}`)
            },
            {
                label: 'Certificados',
                icon: <Award size={16} />,
                action: (id) => navigate(`/escuteiros/gestao/escuteiro/certificado/${id}`)
            }
        ];

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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {actionItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                                    onClick={() => {
                                        item.action(scout.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="mr-2 text-indigo-500">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Check if data is still loading
    const isLoading = loading || loadingAdministracoes || loadingScout || !groupingDetails;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Navigation Items
    const navItems = [
        { id: 'info', icon: 'pi pi-info-circle', label: 'Informações Gerais' },
        { id: 'location', icon: 'pi pi-map-marker', label: 'Localização' },
        { id: 'contacts', icon: 'pi pi-phone', label: 'Contatos' },
        { id: 'scouts', icon: 'pi pi-users', label: 'Escuteiros' },
        { id: 'stats', icon: 'pi pi-chart-bar', label: 'Estatísticas' },
        { id: 'regional', icon: 'pi pi-sitemap', label: 'Administração Regional' }
    ];

    // Categorias com cores específicas para badges
    const categoryColors = {
        'LOBITO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'JUNIORS': 'bg-green-100 text-green-800 border-green-300',
        'SENIORS': 'bg-blue-100 text-blue-800 border-blue-300',
        'CAMINHEIROS': 'bg-red-100 text-red-800 border-red-300',
        'DIRIGENTES': 'bg-purple-100 text-purple-800 border-purple-300'
    };

    // UI Components
    const NavItem = ({ icon, label, active, onClick }) => (
        <div
            onClick={onClick}
            className={`
                flex items-center px-4 py-3 rounded-lg cursor-pointer transition-all
                ${active
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }
            `}
        >
            <i className={`${icon} text-lg mr-3`}></i>
            <span>{label}</span>
        </div>
    );

    const InfoCard = ({ title, children, icon }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
            {title && (
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    {icon && <i className={`${icon} mr-2 text-indigo-500`}></i>}
                    {title}
                </h3>
            )}
            {children}
        </div>
    );

    const InfoRow = ({ label, value, icon }) => (
        <div className="flex items-center mb-4 last:mb-0">
            {icon && <i className={`${icon} text-indigo-500 mr-3 text-lg`}></i>}
            <div>
                <div className="text-sm text-gray-500 mb-1">{label}</div>
                <div className="text-gray-800 font-medium">{value || 'N/A'}</div>
            </div>
        </div>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <div className={`bg-${color}-50 p-4 rounded-xl border border-${color}-100 flex items-center justify-between`}>
            <div>
                <h3 className={`text-${color}-800 text-sm font-medium mb-1`}>{title}</h3>
                <p className={`text-${color}-900 text-2xl font-bold`}>{value}</p>
            </div>
            <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
                <i className={`${icon} text-xl text-${color}-600`}></i>
            </div>
        </div>
    );

    // Category statistics
    const CategoryBar = ({ label, count, color, percentage }) => (
        <div className="mb-4">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <span className="text-sm text-gray-500">{count} ({percentage}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className={`bg-${color}-500 h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );

    // Calculate percentages for category bars
    const calculateCategoryStats = () => {
        const { categorias } = scoutStats;
        const total = Object.values(categorias).reduce((sum, val) => sum + val, 0);

        if (total === 0) return [];

        return [
            {
                label: 'Lobitos',
                count: categorias.lobitos,
                color: 'yellow',
                percentage: Math.round((categorias.lobitos / total) * 100)
            },
            {
                label: 'Juniors',
                count: categorias.juniors,
                color: 'green',
                percentage: Math.round((categorias.juniors / total) * 100)
            },
            {
                label: 'Seniors',
                count: categorias.seniors,
                color: 'blue',
                percentage: Math.round((categorias.seniors / total) * 100)
            },
            {
                label: 'Caminheiros',
                count: categorias.caminheiros,
                color: 'red',
                percentage: Math.round((categorias.caminheiros / total) * 100)
            },
            {
                label: 'Dirigentes',
                count: categorias.dirigentes,
                color: 'purple',
                percentage: Math.round((categorias.dirigentes / total) * 100)
            }
        ];
    };

    // Main layout
    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-700 h-24"></div>
                <div className="px-6 pb-6 relative">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="h-28 w-28 bg-indigo-100 rounded-full flex items-center justify-center -mt-14 border-4 border-white shadow-lg">
                            <i className="pi pi-building text-indigo-600 text-4xl"></i>
                        </div>
                        <div className="flex-1 mt-4 md:mt-0">
                            <h1 className="text-2xl font-bold text-gray-900">{groupingDetails.nome}</h1>
                            <p className="text-gray-500 mt-1">Código: {groupingDetails.codigo}</p>
                            <div className="mt-4">
                                <div className="inline-flex flex-wrap items-center p-1 rounded-xl">
                                    {/* Number chip */}
                                    <div className="m-1 px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-medium flex items-center">
                                        <i className="pi pi-hashtag mr-2 text-white"></i>
                                        Nº {groupingDetails.numero}
                                    </div>

                                    {/* Region chip */}
                                    <div className="m-1 px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium flex items-center">
                                        <i className="pi pi-map mr-2"></i>
                                        {provincia ? provinciaAdminRegional?.nome : 'Região Não Definida'}
                                    </div>

                                    {/* Religion chip */}
                                    <div className="m-1 px-4 py-1.5 rounded-lg bg-teal-600 text-white font-medium flex items-center">
                                        <i className="pi pi-heart mr-2"></i>
                                        {groupingDetails.credo}
                                    </div>

                                    {/* Foundation date chip */}
                                    <div className="m-1 px-4 py-1.5 rounded-lg bg-green-600 text-white font-medium flex items-center">
                                        <i className="pi pi-calendar mr-2"></i>
                                        Fundado em {formatDate(groupingDetails.data_fundacao || groupingDetails.dataDeFundacao)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Navigation */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 sticky top-6">
                            {navItems.map(item => (
                                <NavItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    active={activeSection === item.id}
                                    onClick={() => setActiveSection(item.id)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Informações Gerais Section */}
                            {activeSection === 'info' && (
                                <>
                                    <InfoCard title="Informações do Agrupamento" icon="pi pi-info-circle">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <InfoRow label="Nome" value={groupingDetails.nome} icon="pi pi-tag" />
                                            <InfoRow label="Número" value={groupingDetails.numero} icon="pi pi-hashtag" />
                                            <InfoRow label="Código" value={groupingDetails.codigo} icon="pi pi-key" />
                                            <InfoRow
                                                label="Data de Fundação"
                                                value={formatDate(groupingDetails.data_fundacao || groupingDetails.dataDeFundacao)}
                                                icon="pi pi-calendar"
                                            />
                                            <InfoRow label="Credo" value={groupingDetails.credo} icon="pi pi-heart" />
                                            <InfoRow
                                                label="Administração Regional"
                                                value={admRegional ? admRegional.nome : 'Não Associado'}
                                                icon="pi pi-sitemap"
                                            />
                                        </div>
                                    </InfoCard>

                                    <InfoCard title="Resumo Estatístico" icon="pi pi-chart-bar">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <StatCard
                                                title="Total de Escuteiros"
                                                value={scoutStats.total}
                                                icon="pi pi-users"
                                                color="indigo"
                                            />
                                            <StatCard
                                                title="Escuteiros Ativos"
                                                value={scoutStats.ativos}
                                                icon="pi pi-check-circle"
                                                color="green"
                                            />
                                            <StatCard
                                                title="Escuteiros Inativos"
                                                value={scoutStats.inativos}
                                                icon="pi pi-times-circle"
                                                color="red"
                                            />
                                        </div>
                                    </InfoCard>
                                </>
                            )}

                            {/* Localização Section */}
                            {activeSection === 'location' && (
                                <InfoCard title="Informações de Localização" icon="pi pi-map-marker">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoRow label="Paróquia" value={groupingDetails.paroquia} icon="pi pi-home" />

                                        <InfoRow label="Cidade" value={groupingDetails.cidade} icon="pi pi-globe" />
                                        <InfoRow label="Município" value={groupingDetails.municipio} icon="pi pi-map" />
                                        <InfoRow label="Rua" value={groupingDetails.rua} icon="pi pi-directions" />
                                        <InfoRow
                                            label="Região Administrativa"
                                            value={admRegional ? admRegional.nome : 'N/A'}
                                            icon="pi pi-flag"
                                        />
                                    </div>
                                </InfoCard>
                            )}

                            {/* Contatos Section */}
                            {activeSection === 'contacts' && (
                                <InfoCard title="Informações de Contato" icon="pi pi-phone">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoRow label="Telefone" value={groupingDetails.telefone} icon="pi pi-phone" />
                                        <InfoRow label="Email" value={groupingDetails.email} icon="pi pi-envelope" />
                                    </div>
                                </InfoCard>
                            )}

                            {/* Escuteiros Section */}
                            {activeSection === 'scouts' && (
                                <InfoCard title="Escuteiros do Agrupamento" icon="pi pi-users">
                                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-indigo-800">Total de Escuteiros</h3>
                                                <p className="text-indigo-600">Este agrupamento possui {scoutStats.total} escuteiros registrados</p>
                                            </div>
                                            <div className="bg-white rounded-full h-16 w-16 flex items-center justify-center shadow-sm">
                                                <span className="text-2xl font-bold text-indigo-700">{scoutStats.total}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status Summary Cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                                <i className="pi pi-check-circle text-green-500 mr-2"></i>
                                                Escuteiros Ativos
                                            </h4>
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                                    <span className="text-xl font-bold text-green-700">{scoutStats.ativos}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        {scoutStats.total > 0
                                                            ? `${Math.round((scoutStats.ativos / scoutStats.total) * 100)}% do total`
                                                            : '0% do total'
                                                        }
                                                    </p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                        <div
                                                            className="bg-green-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${scoutStats.total > 0
                                                                    ? Math.round((scoutStats.ativos / scoutStats.total) * 100)
                                                                    : 0}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                                            <h4 className="font-medium text-gray-700 mb-3 flex items-center">
                                                <i className="pi pi-times-circle text-blue-500 mr-2"></i>
                                                Escuteiros Inativos
                                            </h4>
                                            <div className="flex items-center">
                                                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mr-4">
                                                    <span className="text-xl font-bold text-red-700">{scoutStats.inativos}</span>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">
                                                        {scoutStats.total > 0
                                                            ? `${Math.round((scoutStats.inativos / scoutStats.total) * 100)}% do total`
                                                            : '0% do total'
                                                        }
                                                    </p>
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                        <div
                                                            className="bg-blue-500 h-2 rounded-full"
                                                            style={{
                                                                width: `${scoutStats.total > 0
                                                                    ? Math.round((scoutStats.inativos / scoutStats.total) * 100)
                                                                    : 0}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Filtros e Controles */}
                                    <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
                                        <div className="flex flex-wrap gap-4 items-center">
                                            {/* Busca com CustomInput */}
                                            <div className="flex-1 min-w-[280px]">
                                                <CustomInput
                                                    type="text"
                                                    placeholder="Buscar escuteiro por nome..."
                                                    value={searchScoutTerm}
                                                    onChange={(value) => setSearchScoutTerm(value)}
                                                    iconStart={<Search size={18} />}
                                                />
                                            </div>

                                            {/* Filtro de categoria com CustomInput */}
                                            <div className="md:w-[220px] w-full">
                                                <CustomInput
                                                    type="select"
                                                    placeholder="Categoria"
                                                    value={selectedScoutCategory ? { label: selectedScoutCategory, value: selectedScoutCategory } : null}
                                                    options={[
                                                        { label: 'Todas as Categorias', value: '' },
                                                        ...uniqueScoutCategories.map(cat => ({ label: cat, value: cat }))
                                                    ]}
                                                    onChange={(option) => setSelectedScoutCategory(option?.value || '')}
                                                    iconStart={<Filter size={18} />}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scouts Table */}
                                    <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                                        {/* Table for medium and large screens */}
                                        <div className="hidden md:block overflow-auto" style={{ maxHeight: 'calc(100vh - 450px)' }}>
                                            <table className="w-full border-collapse">
                                                <thead className="bg-gray-50 sticky top-0 z-10">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                            Escuteiro
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                            Categoria
                                                        </th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                            Informações
                                                        </th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                            Status
                                                        </th>
                                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                                            Ações
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 bg-white">
                                                    {escuteirosPorAgrupamento.map((escuteiro) => (
                                                        <tr key={escuteiro.id} className="hover:bg-indigo-50 transition-colors">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={getScoutImageUrl(escuteiro.id)}
                                                                        alt={escuteiro.nome || 'Avatar'}
                                                                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                                                                        onError={() => {
                                                                            setScoutImageErrors(prev => ({ ...prev, [escuteiro.id]: true }));
                                                                        }}
                                                                    />
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-semibold text-gray-900">{escuteiro.nome}</div>
                                                                        <div className="text-xs text-gray-500 mt-1">BI: {escuteiro.bi}</div>
                                                                        <div className="text-xs text-gray-500">Código: {escuteiro.codigo}</div>
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${categoryColors[escuteiro.categoria] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                                    {escuteiro.categoria || 'N/A'}
                                                                </span>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex flex-col space-y-2">
                                                                    <div className="flex items-center text-xs text-gray-700">
                                                                        <i className="pi pi-map-marker text-indigo-500 mr-2"></i>
                                                                        {escuteiro.municipio}{escuteiro.provincia ? `, ${escuteiro.provincia}` : ''}
                                                                    </div>
                                                                    <div className="flex items-center text-xs text-gray-700">
                                                                        <i className="pi pi-calendar text-indigo-500 mr-2"></i>
                                                                        {formatDate(escuteiro.dataDeNascimento)}
                                                                    </div>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center justify-center">
                                                                    <button
                                                                        onClick={() => toggleScoutStatus(escuteiro.id, escuteiro.estado || escuteiro.status)}
                                                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'bg-green-500' : 'bg-gray-200'}`}
                                                                    >
                                                                        <span
                                                                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'translate-x-5' : 'translate-x-0'}`}
                                                                        />
                                                                    </button>
                                                                    <span className={`ml-2 text-xs font-medium ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'text-green-600' : 'text-gray-500'}`}>
                                                                        {escuteiro.estado || escuteiro.status || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </td>

                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center justify-center space-x-1">
                                                                    <button
                                                                        onClick={() => navigate(`/escuteiros/gestao/escuteiro/visualizar/${escuteiro.id}`)}
                                                                        className="p-2 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 rounded-full transition-colors"
                                                                        title="Visualizar"
                                                                    >
                                                                        <Eye className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => navigate(`/escuteiros/editar/${escuteiro.id}`)}
                                                                        className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                                        title="Editar"
                                                                    >
                                                                        <Pencil className="w-5 h-5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteGroupingScout(escuteiro.id)}
                                                                        className="p-2 hover:bg-red-100 text-blue-600 hover:text-red-800 rounded-full transition-colors"
                                                                        title="Remover"
                                                                    >
                                                                        <Trash2 className="w-5 h-5" />
                                                                    </button>
                                                                    <ScoutActionMenu scout={escuteiro} />
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Cards for small screens */}
                                        <div className="md:hidden">
                                            {escuteirosPorAgrupamento.map((escuteiro) => (
                                                <div key={escuteiro.id} className="p-4 border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                                                    <div className="flex items-start">
                                                        <img
                                                            src={getScoutImageUrl(escuteiro.id)}
                                                            alt={escuteiro.nome || 'Avatar'}
                                                            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm"
                                                            onError={() => {
                                                                setScoutImageErrors(prev => ({ ...prev, [escuteiro.id]: true }));
                                                            }}
                                                        />
                                                        <div className="flex-1 ml-4">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h3 className="text-sm font-semibold text-gray-900">{escuteiro.nome}</h3>
                                                                    <div className="text-xs text-gray-500 mt-1">BI: {escuteiro.bi}</div>
                                                                    <div className="text-xs text-gray-500">Código: {escuteiro.codigo}</div>
                                                                </div>
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${categoryColors[escuteiro.categoria] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                                    {escuteiro.categoria || 'N/A'}
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 grid grid-cols-2 gap-2">
                                                                <div className="flex items-center text-xs text-gray-700">
                                                                    <i className="pi pi-map-marker text-indigo-500 mr-1"></i>
                                                                    <span className="truncate">{escuteiro.municipio}</span>
                                                                </div>
                                                                <div className="flex items-center text-xs text-gray-700">
                                                                    <i className="pi pi-calendar text-indigo-500 mr-1"></i>
                                                                    {formatDate(escuteiro.dataDeNascimento)}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                                    <span className={`text-xs font-medium ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'text-green-600' : 'text-gray-500'}`}>
                                                                        {escuteiro.estado || escuteiro.status || 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="mt-3 flex justify-between items-center">
                                                                <div className="flex space-x-1">
                                                                    <button
                                                                        onClick={() => navigate(`/escuteiros/gestao/escuteiro/visualizar/${escuteiro.id}`)}
                                                                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-colors"
                                                                        title="Visualizar"
                                                                    >
                                                                        <i className="pi pi-eye text-sm"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => navigate(`/escuteiros/editar/${escuteiro.id}`)}
                                                                        className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                                        title="Editar"
                                                                    >
                                                                        <i className="pi pi-pencil text-sm"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteGroupingScout(escuteiro.id)}
                                                                        className="p-1.5 bg-blue-50 hover:bg-red-100 text-blue-600 rounded-full transition-colors"
                                                                        title="Remover"
                                                                    >
                                                                        <i className="pi pi-trash text-sm"></i>
                                                                    </button>
                                                                </div>

                                                                <div className="flex items-center space-x-3">
                                                                    <button
                                                                        onClick={() => toggleScoutStatus(escuteiro.id, escuteiro.estado || escuteiro.status)}
                                                                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'bg-green-500' : 'bg-gray-200'}`}
                                                                    >
                                                                        <span
                                                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${(escuteiro.estado === 'Ativo' || escuteiro.status === 'Ativo') ? 'translate-x-5' : 'translate-x-0'}`}
                                                                        />
                                                                    </button>
                                                                    <ScoutActionMenu scout={escuteiro} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Paginação */}
                                        <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                                <div className="text-sm text-gray-700">
                                                    Mostrando{' '}
                                                    <span className="font-medium">{((currentScoutPage - 1) * scoutsPerPage) + 1}</span>
                                                    {' '}a{' '}
                                                    <span className="font-medium">
                                                        {Math.min(currentScoutPage * scoutsPerPage, escuteirosPorAgrupamento.length)}
                                                    </span>
                                                    {' '}de{' '}
                                                    <span className="font-medium">{escuteirosPorAgrupamento.length}</span>
                                                    {' '}resultados
                                                </div>

                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setCurrentScoutPage(prev => Math.max(prev - 1, 1))}
                                                        disabled={currentScoutPage === 1}
                                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                                            ${currentScoutPage === 1
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                                                            }`}
                                                    >
                                                        <i className="pi pi-chevron-left mr-1 text-sm"></i>
                                                        Anterior
                                                    </button>

                                                    <button
                                                        onClick={() => setCurrentScoutPage(prev => Math.min(prev + 1, totalScoutPages))}
                                                        disabled={currentScoutPage === totalScoutPages || totalScoutPages === 0}
                                                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                                            ${currentScoutPage === totalScoutPages || totalScoutPages === 0
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                                                            }`}
                                                    >
                                                        Próximo
                                                        <i className="pi pi-chevron-right ml-1 text-sm"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Estado Vazio */}
                                        {escuteirosPorAgrupamento.length === 0 && (
                                            <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                                                <i className="pi pi-search text-5xl text-gray-300 mb-4"></i>
                                                <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum escuteiro encontrado</h3>
                                                <p className="text-gray-500 max-w-md mb-6">
                                                    {searchScoutTerm || selectedScoutCategory
                                                        ? 'Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.'
                                                        : 'Este agrupamento ainda não possui escuteiros registrados.'}
                                                </p>
                                                {searchScoutTerm || selectedScoutCategory ? (
                                                    <button
                                                        onClick={() => {
                                                            setSearchScoutTerm('');
                                                            setSelectedScoutCategory('');
                                                        }}
                                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                                    >
                                                        Limpar filtros
                                                    </button>
                                                ) : (
                                                    <a href="/escuteiros/adicionar">
                                                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                                                            Adicionar escuteiro
                                                        </button>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Toast de notificações */}
                                    {toastScoutMessage && (
                                        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${toastScoutMessage.type === 'success'
                                            ? 'bg-green-50 border-l-4 border-green-500 text-green-700'
                                            : toastScoutMessage.type === 'error'
                                                ? 'bg-blue-50 border-l-4 border-blue-500 text-red-700'
                                                : 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'} animate-fadeIn`}>
                                            <div className="flex items-center">
                                                <div className="mr-3">
                                                    {toastScoutMessage.type === 'success' ? <i className="pi pi-check-circle"></i> :
                                                        toastScoutMessage.type === 'error' ? <i className="pi pi-times-circle"></i> :
                                                            <i className="pi pi-info-circle"></i>}
                                                </div>
                                                <div>
                                                    <h3 className="font-medium">{toastScoutMessage.title}</h3>
                                                    <p className="text-sm mt-1">{toastScoutMessage.message}</p>
                                                </div>
                                                <button
                                                    className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                                                    onClick={() => setToastScoutMessage(null)}
                                                    aria-label="Fechar notificação"
                                                >
                                                    <i className="pi pi-times text-sm"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </InfoCard>
                            )}

                            {/* Estatísticas Section */}
                            {activeSection === 'stats' && (
                                <InfoCard title="Estatísticas por Categoria" icon="pi pi-chart-bar">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-medium text-gray-700 mb-4">Distribuição por Categoria</h3>
                                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                                            {calculateCategoryStats().map((cat, index) => (
                                                <CategoryBar
                                                    key={index}
                                                    label={cat.label}
                                                    count={cat.count}
                                                    color={cat.color}
                                                    percentage={cat.percentage}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                            <h3 className="text-sm font-medium text-yellow-800 flex items-center">
                                                <i className="pi pi-users text-yellow-600 mr-2"></i>
                                                Lobitos
                                            </h3>
                                            <p className="text-2xl font-bold text-yellow-900 mt-2">{scoutStats.categorias.lobitos}</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <h3 className="text-sm font-medium text-green-800 flex items-center">
                                                <i className="pi pi-users text-green-600 mr-2"></i>
                                                Juniors
                                            </h3>
                                            <p className="text-2xl font-bold text-green-900 mt-2">{scoutStats.categorias.juniors}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <h3 className="text-sm font-medium text-blue-800 flex items-center">
                                                <i className="pi pi-users text-blue-600 mr-2"></i>
                                                Seniors
                                            </h3>
                                            <p className="text-2xl font-bold text-blue-900 mt-2">{scoutStats.categorias.seniors}</p>
                                        </div>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-red-100">
                                            <h3 className="text-sm font-medium text-red-800 flex items-center">
                                                <i className="pi pi-users text-blue-600 mr-2"></i>
                                                Caminheiros
                                            </h3>
                                            <p className="text-2xl font-bold text-red-900 mt-2">{scoutStats.categorias.caminheiros}</p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                            <h3 className="text-sm font-medium text-purple-800 flex items-center">
                                                <i className="pi pi-users text-purple-600 mr-2"></i>
                                                Dirigentes
                                            </h3>
                                            <p className="text-2xl font-bold text-purple-900 mt-2">{scoutStats.categorias.dirigentes}</p>
                                        </div>
                                    </div>
                                </InfoCard>
                            )}

                            {/* Administração Regional Section */}
                            {activeSection === 'regional' && (
                                <InfoCard title="Administração Regional" icon="pi pi-sitemap">
                                    {admRegional ? (
                                        <div className="space-y-6">
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-center mb-4">
                                                <i className="pi pi-building text-blue-600 text-3xl mr-4"></i>
                                                <div>
                                                    <h4 className="text-lg font-semibold text-blue-800">{admRegional.nome}</h4>
                                                    <p className="text-blue-600">Código: {admRegional.codigo}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <InfoRow
                                                    label="Província"
                                                    value={provinciaAdminRegional?.nome}
                                                    icon="pi pi-map"
                                                />
                                                <InfoRow
                                                    label="Administração Nacional"
                                                    value="AEA Angola"
                                                    icon="pi pi-sitemap"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                            <div className="flex items-center text-yellow-700">
                                                <i className="pi pi-exclamation-circle mr-3 text-xl"></i>
                                                <p>Informações da administração regional não disponíveis</p>
                                            </div>
                                        </div>
                                    )}
                                </InfoCard>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GroupingDetailsView;