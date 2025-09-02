import React, { useState, useEffect, useMemo } from 'react';
import {
    Search,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    MoreVertical,
    Eye,
    AlertCircle,
    CheckCircle,
    X,
    MapPin,
    Calendar,
    Building,
    Wrench,
    Users,
    Activity,
    Clock,
    Warehouse,
    Truck,
    Settings
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import CustomInput from '../../components/CustomInput';

const GestaoApoioAgricola = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedEstado, setSelectedEstado] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const itemsPerPage = 20;

    // Dados fictícios para demonstração
   const infraestruturas = [
    {
        id: '1',
        nome_infrastrutura: 'Floresta Modelo de Dundo',
        tipo_infrastrutura: 'Canal de Irrigação',
        localizacao: {
            provincia: 'LUANDA',
            municipio: 'Cacuaco',
            comuna: 'Funda',
            aldeia_zona: 'Zona Industrial',
            coordenadas: {
                latitude: '-8.956',
                longitude: '13.234',
                altitude: '45m',
                precisao_m: '5m'
            }
        },
        caracteristicas_tecnicas: {
            dimensao: '50m x 30m x 8m',
            capacidade: '1200 toneladas',
            estado_conservacao: 'Bom'
        },
        entidade_responsavel: {
            proprietario_instituicao: 'Cooperativa Agrícola Luanda',
            contacto: '+244 923 456 789',
            email: 'cooperativa@luanda.ao'
        },
        utilizacao: {
            beneficiarios_directos: '150 produtores',
            principais_culturas_atividades: 'Milho, Feijão, Mandioca',
            frequencia_utilizacao: 'Diária'
        },
        estado: 'Bom'
    },
    {
        id: '2',
        nome_infrastrutura: 'Represa de Cazenga',
        tipo_infrastrutura: 'Represa/Barragem',
        localizacao: {
            provincia: 'LUANDA',
            municipio: 'Cazenga',
            comuna: 'Sambizanga',
            aldeia_zona: 'Zona Norte',
            coordenadas: {
                latitude: '-8.830',
                longitude: '13.250',
                altitude: '60m',
                precisao_m: '10m'
            }
        },
        caracteristicas_tecnicas: {
            dimensao: '100m x 50m x 12m',
            capacidade: '5000 m³',
            estado_conservacao: 'Razoável'
        },
        entidade_responsavel: {
            proprietario_instituicao: 'Administração Municipal de Cazenga',
            contacto: '+244 923 111 222',
            email: 'adm@cazenga.ao'
        },
        utilizacao: {
            beneficiarios_directos: '300 produtores',
            principais_culturas_atividades: 'Hortaliças e Milho',
            frequencia_utilizacao: 'Semanal'
        },
        estado: 'Razoável'
    },
    {
        id: '3',
        nome_infrastrutura: 'Poço Artesiano de Viana',
        tipo_infrastrutura: 'Furo de Água/Poço Artesiano',
        localizacao: {
            provincia: 'LUANDA',
            municipio: 'Viana',
            comuna: 'Zango',
            aldeia_zona: 'Bairro Central',
            coordenadas: {
                latitude: '-8.800',
                longitude: '13.250',
                altitude: '30m',
                precisao_m: '5m'
            }
        },
        caracteristicas_tecnicas: {
            dimensao: 'Profundidade 50m',
            capacidade: '50 m³/dia',
            estado_conservacao: 'Mau'
        },
        entidade_responsavel: {
            proprietario_instituicao: 'Cooperativa Água Rural Viana',
            contacto: '+244 923 333 444',
            email: 'agua@viana.ao'
        },
        utilizacao: {
            beneficiarios_directos: '80 produtores',
            principais_culturas_atividades: 'Hortaliças',
            frequencia_utilizacao: 'Diária'
        },
        estado: 'Mau'
    },
    {
        id: '4',
        nome_infrastrutura: 'Silo de Grãos de Belas',
        tipo_infrastrutura: 'Silo de Grãos',
        localizacao: {
            provincia: 'LUANDA',
            municipio: 'Belas',
            comuna: 'Quicabo',
            aldeia_zona: 'Zona Industrial',
            coordenadas: {
                latitude: '-8.900',
                longitude: '13.200',
                altitude: '50m',
                precisao_m: '8m'
            }
        },
        caracteristicas_tecnicas: {
            dimensao: '30m x 20m x 10m',
            capacidade: '2000 toneladas',
            estado_conservacao: 'Bom'
        },
        entidade_responsavel: {
            proprietario_instituicao: 'Empresa de Armazenagem Belas',
            contacto: '+244 923 555 666',
            email: 'silo@belas.ao'
        },
        utilizacao: {
            beneficiarios_directos: '200 produtores',
            principais_culturas_atividades: 'Milho, Feijão, Soja',
            frequencia_utilizacao: 'Mensal'
        },
        estado: 'Bom'
    }
];


    const [localInfraestruturas, setLocalInfraestruturas] = useState(infraestruturas);

    // Mostrar toast
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

    // Navegação
    const handleViewInfraestrutura = (id) => {
        showToast('info', 'Visualizar', `Visualizando infraestrutura ${id}`);
    };

    const handleEditInfraestrutura = (id) => {
        showToast('info', 'Editar', `Editando infraestrutura ${id}`);
    };

    // Modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [infraestruturaToDelete, setInfraestruturaToDelete] = useState(null);

    const openDeleteModal = (id) => {
        setInfraestruturaToDelete(id);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setInfraestruturaToDelete(null);
    };

    const handleConfirmDelete = () => {
        if (!infraestruturaToDelete) return;
        
        setLocalInfraestruturas(prev =>
            prev.filter(infra => infra.id !== infraestruturaToDelete)
        );
        showToast('success', 'Sucesso', 'Infraestrutura removida com sucesso');
        closeDeleteModal();
    };

    // Filtragem
    const filteredInfraestruturas = localInfraestruturas.filter(infra => {
        const matchesSearch = 
            infra.nome_infrastrutura.toLowerCase().includes(searchTerm.toLowerCase()) ||
            infra.localizacao.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
            infra.entidade_responsavel.proprietario_instituicao.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesTipo = !selectedTipo || infra.tipo_infrastrutura === selectedTipo;
        const matchesEstado = !selectedEstado || infra.caracteristicas_tecnicas.estado_conservacao === selectedEstado;

        return matchesSearch && matchesTipo && matchesEstado;
    });

    // Paginação
    const totalPages = Math.ceil(filteredInfraestruturas.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredInfraestruturas.slice(startIndex, endIndex);
    };

    // Cores para estado de conservação
    const getEstadoColor = (estado) => {
        const colors = {
            'Bom': 'bg-blue-100 text-blue-800 border-blue-300',
            'Razoável': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Mau': 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[estado] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Ícones por tipo
    const getTipoIcon = (tipo) => {
        const icons = {
            'Canal de Irrigação': <Activity className="w-4 h-4" />,
            'Represa/Barragem': <Activity className="w-4 h-4" />,
            'Furo de Água/Poço Artesiano': <Activity className="w-4 h-4" />,
            'Silo de Grãos': <Warehouse className="w-4 h-4" />,
            'Armazém': <Warehouse className="w-4 h-4" />,
            'Mercado': <Building className="w-4 h-4" />
        };
        return icons[tipo] || <Building className="w-4 h-4" />;
    };

    // Estatísticas
    const totalInfraestruturas = localInfraestruturas.length;
    const totalBom = localInfraestruturas.filter(i => i.caracteristicas_tecnicas.estado_conservacao === 'Bom').length;
    const totalRazoavel = localInfraestruturas.filter(i => i.caracteristicas_tecnicas.estado_conservacao === 'Razoável').length;
    const totalMau = localInfraestruturas.filter(i => i.caracteristicas_tecnicas.estado_conservacao === 'Mau').length;

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

    // Modal de confirmação de exclusão
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const infra = localInfraestruturas.find(i => i.id === infraestruturaToDelete);
        
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir a infraestrutura <span className="font-semibold text-red-600">{infra?.nome_infrastrutura || 'Selecionada'}</span>?<br/>
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 mt-2 w-full">
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Sim, excluir
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Toast />
            
            {/* Indicadores do topo */}
            <div className="w-full flex justify-center bg-transparent pb-[30px] pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Building className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{totalInfraestruturas}</p>
                            </div>
                        </div>
                    </div>
                   
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Bom</p>
                                <p className="text-2xl font-bold text-gray-900">{totalBom}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Razoável</p>
                                <p className="text-2xl font-bold text-gray-900">{totalRazoavel}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Mau</p>
                                <p className="text-2xl font-bold text-gray-900">{totalMau}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-xl overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-md mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Infraestruturas de Apoio à Agricultura</h1>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados das infraestruturas')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-xl shadow-md overflow-auto">
                    {/* Barra de ferramentas */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Busca */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="text"
                                    placeholder="Pesquisar por nome, BI/NIF, província ou instituição..."
                                    value={searchTerm}
                                    onChange={(value) => setSearchTerm(value)}
                                    iconStart={<Search size={18} />}
                                />
                            </div>

                            {/* Filtro Tipo */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Tipo de Infraestrutura"
                                    value={selectedTipo ? { label: selectedTipo, value: selectedTipo } : null}
                                    options={[
                                        { label: 'Todos os Tipos', value: '' },
                                        { label: 'Armazém', value: 'Armazém' },
                                        { label: 'Sistema de Irrigação', value: 'Sistema de Irrigação' },
                                        { label: 'Mercado', value: 'Mercado' },
                                        { label: 'Unidade de Processamento', value: 'Unidade de Processamento' },
                                        { label: 'Infraestrutura de Transporte', value: 'Infraestrutura de Transporte' }
                                    ]}
                                    onChange={(option) => setSelectedTipo(option?.value || '')}
                                    iconStart={<Filter size={18} />}
                                />
                            </div>

                            {/* Filtro Estado */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Estado de Conservação"
                                    value={selectedEstado ? { label: selectedEstado, value: selectedEstado } : null}
                                    options={[
                                        { label: 'Todos os Estados', value: '' },
                                        { label: 'Excelente', value: 'Excelente' },
                                        { label: 'Bom', value: 'Bom' },
                                        { label: 'Razoável', value: 'Razoável' },
                                        { label: 'Mau', value: 'Mau' }
                                    ]}
                                    onChange={(option) => setSelectedEstado(option?.value || '')}
                                    iconStart={<Wrench size={18} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabela - Desktop */}
                    <div className="hidden md:block overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                       Infraestrutura 
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Localização
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Características
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Entidade 
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Utilização
                                    </th>
                                   
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Estado
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {getCurrentItems().map((infra) => (
                                      <div key={infra.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                    <div className="flex items-start">
                                        <ProdutorAvatar 
                                            infra={infra}
                                            size="w-14 h-14"
                                            textSize="text-sm"
                                        />
                                        <div className="flex-1 ml-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">{infra.nome}</h3>
                                                    <div className="text-xs text-gray-500 mt-1">Código: {infra.codigoRNPA}</div>
                                                    <div className="text-xs text-gray-500">GPS: {infra.coordenadasGPS}</div>
                                                </div>
                                                <StatusMenu infra={infra} />
                                            </div>

                                            <div className="mt-3 space-y-2">
                                                <div className="flex items-center text-xs">
                                                    <Building className="w-3 h-3 mr-1 text-blue-500" />
                                                    <span className="font-medium">{infra.propriedade.tipo}:</span>
                                                    <span className="ml-1 text-gray-600">{infra.propriedade.nome}</span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {infra.especiesPredominantes.slice(0, 2).map((especie, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <Leaf className="w-3 h-3 mr-1" />
                                                            {especie}
                                                        </span>
                                                    ))}
                                                    {infra.especiesPredominantes.length > 2 && (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                            +{infra.especiesPredominantes.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    <TreePine className="w-3 h-3 mr-1 text-green-500" />
                                                    <span className="font-medium">{infra.volumeEstimado} m³</span>
                                                    <span className="ml-2 text-gray-500">|</span>
                                                    <FileText className="w-3 h-3 ml-2 mr-1 text-blue-500" />
                                                    <span className={`px-2 py-0.5 rounded text-xs ${
                                                        infra.licenciamento.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                                                        infra.licenciamento.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {infra.licenciamento.status}
                                                    </span>
                                                </div>
                                                {infra.transporte.destino !== 'N/A' && (
                                                    <div className="flex items-center text-xs text-gray-600">
                                                        <Truck className="w-3 h-3 mr-1 text-blue-500" />
                                                        <span>{infra.transporte.destino}</span>
                                                        {infra.transporte.placa !== 'N/A' && (
                                                            <span className="ml-2">({infra.transporte.placa})</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-3 flex justify-between items-center">
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={(infra.id)}
                                                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                        title="Visualizar"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(infra.id)}
                                                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                        title="Remover"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <ActionMenu infra={infra} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Visualização em cards para mobile */}
                    <div className="md:hidden overflow-auto">
                        {getCurrentItems().map((infra) => (
                            <div key={infra.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900">{infra.nome_infrastrutura}</h3>
                                        <div className="text-xs text-gray-500 mt-1">BI/NIF: {infra.bi_nif}</div>
                                        <div className="text-xs text-gray-500">Data: {new Date(infra.data_registo).toLocaleDateString('pt-BR')}</div>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getEstadoColor(infra.caracteristicas_tecnicas.estado_conservacao)}`}>
                                        {infra.caracteristicas_tecnicas.estado_conservacao}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-xs">
                                        <span className="mr-2 text-blue-500">
                                            {getTipoIcon(infra.tipo_infrastrutura)}
                                        </span>
                                        <span className="font-medium">Tipo:</span>
                                        <span className="ml-1 text-gray-600">{infra.tipo_infrastrutura}</span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                                        <span className="font-medium">Local:</span>
                                        <span className="ml-1 text-gray-600">{infra.localizacao.provincia} - {infra.localizacao.municipio}</span>
                                    </div>
                                    <div className="flex items-center text-xs">
                                        <Users className="w-3 h-3 mr-1 text-green-500" />
                                        <span className="font-medium">Beneficiários:</span>
                                        <span className="ml-1 text-gray-600">{infra.utilizacao.beneficiarios_directos}</span>
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-between items-center">
                                    <div className="flex space-x-1">
                                        <button
                                            onClick={() => handleViewInfraestrutura(infra.id)}
                                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                            title="Visualizar"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEditInfraestrutura(infra.id)}
                                            className="p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-full transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(infra.id)}
                                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                            title="Remover"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paginação */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredInfraestruturas.length)} de {filteredInfraestruturas.length} infraestruturas
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <span className="px-3 py-2 text-sm font-medium">
                                        Página {currentPage} de {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Nenhum resultado encontrado */}
                    {filteredInfraestruturas.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <Search className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                Nenhuma infraestrutura encontrada
                            </h3>
                            <p className="text-gray-500 max-w-md mb-6">
                                Não encontramos resultados para a sua busca. Tente outros termos ou remova os filtros aplicados.
                            </p>
                            {(searchTerm || selectedTipo || selectedEstado) && (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedTipo('');
                                        setSelectedEstado('');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    )}
                </div>
                
                <DeleteConfirmModal />
            </div>
        </div>
    );
};

export default GestaoApoioAgricola;