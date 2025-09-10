import React, { useState, useCallback, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, UserPlus, AlertCircle, CheckCircle, XCircle, Info, FilterIcon } from 'lucide-react';
import api from '../services/api';
import { useGroupings, useScout } from '../hooks/useScoutData';
import CustomInput from '../components/CustomInput';

const PromocaoEscuteiros = () => {
    const BASE_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';
    const [selectedEscuteiros, setSelectedEscuteiros] = useState([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [imageErrors, setImageErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);

    const itemsPerPage = 5;
    const { scout, loading: loadingScout, mutate } = useScout();
    const { groupings } = useGroupings();

    // Mapa de progressão de categorias
    const categoriaProgressao = {
        'LOBITO': 'JUNIOR',
        'JUNIOR': 'SENIOR',
        'SENIOR': 'CAMINHEIRO',
        'CAMINHEIRO': 'DIRIGENTE'
    };

    // Função para mostrar toast com auto-dismiss
    const showToast = useCallback((type, title, message, duration = 5000) => {
        // Limpa qualquer timeout existente
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        // Define a mensagem do toast
        setToastMessage({ type, title, message });

        // Configura timeout para auto-dismiss
        const timeout = setTimeout(() => {
            setToastMessage(null);
        }, duration);

        setToastTimeout(timeout);
    }, [toastTimeout]);

    // Limpar o timeout ao desmontar o componente
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    const getImageUrl = (escuteiroId) => {
        if (!escuteiroId || imageErrors[escuteiroId]) return '/assets/placeholder-profile.png';
        return `${BASE_URL}/escuteiro/${escuteiroId}/imagem`;
    };

    const handleImageError = (id) => {
        setImageErrors(prev => ({
            ...prev,
            [id]: true
        }));
    };

    // Função para formatar data para exibição
    const formatarData = (dataStr) => {
        if (!dataStr) return '';

        try {
            const data = new Date(dataStr);
            if (isNaN(data.getTime())) return 'Data inválida';

            return data.toLocaleDateString('pt-BR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return 'Data inválida';
        }
    };

    // Filtrar escuteiros não-dirigentes e aplicar busca
    const filteredData = scout?.filter(item => {
        const matchesSearch = item.nome?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || item.categoria === selectedCategory;
        const isNotDirigente = item.categoria !== 'DIRIGENTES';
        return matchesSearch && matchesCategory && isNotDirigente;
    }) || [];

    // Paginação
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const calculateAge = (birthDate) => {
        if (!birthDate) {
            return 'N/A';
        }

        try {
            // Certifique-se de que a data está no formato correto
            let birth;

            // Se a data é uma string, converta para objeto Date
            if (typeof birthDate === 'string') {
                // Trate diferentes formatos de data
                if (birthDate.includes('T')) {
                    // Formato ISO: "2000-01-01T00:00:00"
                    birth = new Date(birthDate);
                } else if (birthDate.includes('-')) {
                    // Formato "YYYY-MM-DD" ou similar
                    const parts = birthDate.split('-');
                    if (parts.length === 3) {
                        birth = new Date(
                            parseInt(parts[0]),
                            parseInt(parts[1]) - 1, // Meses em JS são 0-indexed
                            parseInt(parts[2])
                        );
                    } else {
                        birth = new Date(birthDate);
                    }
                } else if (birthDate.includes('/')) {
                    // Formato "DD/MM/YYYY" ou similar
                    const parts = birthDate.split('/');
                    if (parts.length === 3) {
                        birth = new Date(
                            parseInt(parts[2]),
                            parseInt(parts[1]) - 1,
                            parseInt(parts[0])
                        );
                    } else {
                        birth = new Date(birthDate);
                    }
                } else {
                    birth = new Date(birthDate);
                }
            } else {
                birth = new Date(birthDate);
            }

            // Verificar se a data é válida
            if (isNaN(birth.getTime())) {
                console.warn("Data de nascimento inválida:", birthDate);
                return 'N/A';
            }

            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }

            return age;
        } catch (error) {
            console.error("Erro ao calcular idade:", error);
            return 'N/A';
        }
    };

    const podeSerPromovido = (escuteiro) => {
        if (!escuteiro) return false;

        const idade = calculateAge(escuteiro.dataDeNascimento);
        if (idade === 'N/A') return false;

        switch (escuteiro.categoria) {
            case 'LOBITO': return idade >= 11;
            case 'JUNIORS': return idade >= 14;
            case 'SENIORS': return idade >= 18;
            case 'CAMINHEIROS': return idade >= 22;
            default: return false;
        }
    };

    const promoverEscuteiros = async () => {
        setLoading(true);
        try {
            const escuteirosElegiveis = selectedEscuteiros.filter(podeSerPromovido);

            if (escuteirosElegiveis.length === 0) {
                showToast('warning', 'Aviso', 'Nenhum escuteiro selecionado atende aos requisitos de idade para promoção.');
                setShowConfirmDialog(false);
                setLoading(false);
                return;
            }

            const promocoes = escuteirosElegiveis.map(escuteiro => {
                // Usar a nova rota da API
                return api.post(`/api/escuteiro/promover/${escuteiro.id}`);
            });

            await Promise.all(promocoes);
            await mutate(); // Atualizar dados após promoção

            showToast('success', 'Sucesso', 'Escuteiros promovidos com sucesso!');
            setSelectedEscuteiros([]);
            setShowConfirmDialog(false);
        } catch (error) {
            console.error("Erro ao promover escuteiros:", error);
            showToast('error', 'Erro', 'Erro ao promover escuteiros. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectAll = (checked) => {
        if (checked) {
            // Selecionar todos os itens da página atual
            setSelectedEscuteiros(getCurrentItems());
        } else {
            // Desmarcar todos os itens
            setSelectedEscuteiros([]);
        }
    };

    const toggleSelectEscuteiro = (escuteiro, checked) => {
        if (checked) {
            setSelectedEscuteiros(prev => [...prev, escuteiro]);
        } else {
            setSelectedEscuteiros(prev => prev.filter(e => e.id !== escuteiro.id));
        }
    };

    // Renderização baseada no estado de carregamento
    if (loadingScout) {
        return (
            <div className="min-h-full  flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                <span className="ml-3 text-purple-600 font-medium">Carregando escuteiros...</span>
            </div>
        );
    }

    return (
        <div className="min-h-screen  p-4 md:p-6">
            {/* Toast para notificações */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 animate-fade-in
                    ${toastMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' :
                        toastMessage.type === 'error' ? 'bg-blue-50 border-l-4 border-blue-500 text-red-700' :
                            'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700'}`}
                >
                    <div className="flex items-center">
                        {toastMessage.type === 'success' ? (
                            <CheckCircle className="w-5 h-5 mr-3" />
                        ) : toastMessage.type === 'error' ? (
                            <XCircle className="w-5 h-5 mr-3" />
                        ) : (
                            <AlertCircle className="w-5 h-5 mr-3" />
                        )}
                        <div>
                            <h3 className="font-medium">{toastMessage.title}</h3>
                            <p className="text-sm mt-1">{toastMessage.message}</p>
                        </div>
                        <button
                            className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                            onClick={() => setToastMessage(null)}
                            aria-label="Fechar notificação"
                        >
                            <XCircle className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-dull">
                <div className="bg-white rounded-xl overflow-hidden">
                    {/* Cabeçalho */}
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Promoção de Escuteiros</h1>
                                <p className="text-gray-500 mt-1">Promova escuteiros para suas próximas categorias com base na idade</p>
                            </div>

                            <button
                                onClick={() => selectedEscuteiros.length > 0 && setShowConfirmDialog(true)}
                                disabled={selectedEscuteiros.length === 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow transition-colors
                                    ${selectedEscuteiros.length > 0
                                        ? 'bg-green-500 hover:bg-green-600 text-white'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                            >
                                <UserPlus size={18} />
                                Promover Selecionados ({selectedEscuteiros.length})
                            </button>
                        </div>

                        {/* Barra de ferramentas */}
                        {/* Barra de ferramentas com CustomInput */}
                        <div className="mt-6 flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[280px]">
                                <CustomInput
                                    type="text"
                                    placeholder="Buscar por nome..."
                                    value={searchTerm}
                                    onChange={(value) => setSearchTerm(value)}
                                    iconStart={<Search size={18} className="text-gray-500" />}
                                />
                            </div>

                            <div className="min-w-[200px]">
                                <CustomInput
                                    type="select"
                                    iconStart={<FilterIcon size={18} className="text-gray-500" />}
                                    placeholder="Selecione uma categoria"
                                    value={selectedCategory ? { value: selectedCategory, label: selectedCategory } : ''}
                                    onChange={(value) => setSelectedCategory(value?.value || '')}
                                    options={[
                                        { value: '', label: 'Todas as categorias' },
                                        ...Object.keys(categoriaProgressao).map(cat => ({
                                            value: cat,
                                            label: cat
                                        }))
                                    ]}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contagem e estatísticas */}
                    <div className=" p-4 border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-gray-500 text-sm mb-1">Total de Escuteiros</div>
                                <div className="text-2xl font-bold">{filteredData.length}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-gray-500 text-sm mb-1">Elegíveis para Promoção</div>
                                <div className="text-2xl font-bold text-green-600">
                                    {filteredData.filter(podeSerPromovido).length}
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-gray-500 text-sm mb-1">Selecionados</div>
                                <div className="text-2xl font-bold text-blue-600">{selectedEscuteiros.length}</div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="text-gray-500 text-sm mb-1">Selecionados Elegíveis</div>
                                <div className="text-2xl font-bold text-purple-600">
                                    {selectedEscuteiros.filter(podeSerPromovido).length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabela de escuteiros */}
                    <div className="overflow-x-auto">
                        {filteredData.length > 0 ? (
                            <table className="w-full">
                                <thead className=" text-left">
                                    <tr>
                                        <th className="w-10 px-6 py-3 border-b border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={getCurrentItems().length > 0 && selectedEscuteiros.length === getCurrentItems().length}
                                                onChange={(e) => toggleSelectAll(e.target.checked)}
                                                className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Escuteiro
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Idade
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Categoria Atual
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Próxima Categoria
                                        </th>
                                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getCurrentItems().map((escuteiro) => {
                                        // Calcular idade com tratamento aprimorado
                                        const idade = calculateAge(escuteiro.dataDeNascimento);
                                        const elegivel = podeSerPromovido(escuteiro);
                                        const isSelected = selectedEscuteiros.some(e => e.id === escuteiro.id);

                                        return (
                                            <tr key={escuteiro.id} className={`hover: ${isSelected ? 'bg-blue-50' : ''}`}>
                                                <td className="px-6 py-4 border-b border-gray-200">
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={(e) => toggleSelectEscuteiro(escuteiro, e.target.checked)}
                                                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-200">
                                                    <div className="flex items-center">
                                                        <div className="w-16 h-16 flex-shrink-0 mr-4">
                                                            <img
                                                                src={getImageUrl(escuteiro.id)}
                                                                alt={escuteiro.nome}
                                                                className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                                                                onError={() => handleImageError(escuteiro.id)}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{escuteiro.nome}</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {escuteiro.codigo ? `Código: ${escuteiro.codigo}` : 'Sem código'}
                                                            </div>
                                                            {escuteiro.agrupamento && (
                                                                <div className="text-xs text-gray-500 mt-0.5">
                                                                    {escuteiro.agrupamento.nome}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-200">
                                                    {escuteiro.dataDeNascimento ? (
                                                        <>
                                                            <div className="text-sm text-gray-900 font-medium">
                                                                {idade === 'N/A' ? 'Idade desconhecida' : `${idade} anos`}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                Nasc: {formatarData(escuteiro.dataDeNascimento)}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-sm text-orange-500">
                                                            Data de nascimento não informada
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-200">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {escuteiro.categoria}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-200">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        {categoriaProgressao[escuteiro.categoria] || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b border-gray-200">
                                                    {elegivel ? (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                                            Elegível
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            <XCircle className="w-3.5 h-3.5 mr-1" />
                                                            Não Elegível
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-6 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Search className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-lg">Nenhum escuteiro encontrado</p>
                                <p className="text-gray-400 text-sm mt-1">Tente ajustar os filtros de busca</p>
                            </div>
                        )}
                    </div>

                    {/* Paginação */}
                    {filteredData.length > 0 && (
                        <div className=" px-6 py-4 border-t border-gray-100">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="text-sm text-gray-700">
                                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} escuteiros
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover: border border-gray-300 shadow-sm'
                                            }`}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover: border border-gray-300 shadow-sm'
                                            }`}
                                    >
                                        Próximo
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Confirmação */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full animate-slide-up">
                        <div className="p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800">Confirmar Promoção</h2>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">
                                Resumo da Promoção
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className=" p-3 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-500">Selecionados</div>
                                        <div className="text-xl font-bold text-gray-900">{selectedEscuteiros.length}</div>
                                    </div>
                                    <div className=" p-3 rounded-lg border border-gray-200">
                                        <div className="text-sm text-gray-500">Elegíveis</div>
                                        <div className="text-xl font-bold text-green-600">
                                            {selectedEscuteiros.filter(podeSerPromovido).length}
                                        </div>
                                    </div>
                                </div>

                                {selectedEscuteiros.some(e => !podeSerPromovido(e)) && (
                                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg">
                                        <div className="flex">
                                            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0" />
                                            <p className="text-sm text-yellow-700">
                                                Alguns escuteiros selecionados não atendem aos requisitos de idade para promoção e serão ignorados.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4  p-4 rounded-lg border border-gray-200">
                                    <h4 className="font-medium mb-2 text-gray-700">Detalhamento por categoria:</h4>
                                    <ul className="space-y-2">
                                        {Object.entries(
                                            selectedEscuteiros.reduce((acc, escuteiro) => {
                                                if (podeSerPromovido(escuteiro)) {
                                                    const proxCategoria = categoriaProgressao[escuteiro.categoria];
                                                    acc[proxCategoria] = (acc[proxCategoria] || 0) + 1;
                                                }
                                                return acc;
                                            }, {})
                                        ).map(([categoria, quantidade]) => (
                                            <li key={categoria} className="text-sm text-gray-700 flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                                <span className="font-medium">{quantidade}</span> escuteiro(s) para <span className="font-medium">{categoria}</span>
                                            </li>
                                        ))}

                                        {selectedEscuteiros.filter(podeSerPromovido).length === 0 && (
                                            <li className="text-sm text-gray-500 italic">
                                                Nenhum escuteiro elegível para promoção
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                                    <div className="flex">
                                        <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0" />
                                        <p className="text-sm text-blue-700">
                                            A promoção será realizada apenas para os escuteiros que atendem aos requisitos de idade. Esta ação não pode ser desfeita.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover: font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={promoverEscuteiros}
                                disabled={loading || selectedEscuteiros.filter(podeSerPromovido).length === 0}
                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${loading || selectedEscuteiros.filter(podeSerPromovido).length === 0
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4" />
                                        <span>Confirmar Promoção</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromocaoEscuteiros;