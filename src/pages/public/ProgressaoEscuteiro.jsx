import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useEtapas, useProgressao, useScout } from '../../hooks/useScoutData';
import { Skeleton } from 'primereact/skeleton';
import { Message } from 'primereact/message';
import api from '../../services/api';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';

const ProgressaoEscuteiro = () => {
    const BASE_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';
    const { id } = useParams();
    const { scout } = useScout();
    const { progressao, loadingProgressao, refetchProgressao } = useProgressao();
    const { etapas } = useEtapas();
    
    const [loading, setLoading] = useState(true);
    const [currentEtapa, setCurrentEtapa] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [etapaAtualObj, setEtapaAtualObj] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);

    const scoutDetails = scout?.find(s => s.id.toString() === id);
    const isDirigente = scoutDetails?.categoria === 'DIRIGENTES';

    // Função para obter a URL da imagem do escuteiro
    const getImageUrl = (escuteiroId) => {
        if (!escuteiroId || imageErrors[escuteiroId]) return '/assets/placeholder-profile.png';
        return `${BASE_URL}/escuteiro/${id}/imagem`;
    };

    // Função para obter a URL da imagem da etapa
    const getEtapaImageUrl = (etapaId) => {
        return `${BASE_URL}/estagioDoProgresso/${etapaId}/imagem`;
    };

    // Handler para mostrar toast com auto-dismiss
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

    useEffect(() => {
        if (progressao?.length > 0 && etapas?.length > 0 && !isDirigente) {
            const escuteiroProgressao = progressao.find(p => p.escuteiro_id === parseInt(id));
            if (escuteiroProgressao) {
                const etapaAtual = etapas.find(e => e.id === escuteiroProgressao.etapa_id);
                if (etapaAtual) {
                    setCurrentEtapa(etapaAtual.etapa);
                    setEtapaAtualObj(etapaAtual);
                }
            }
            setLoading(false);
        } else if (!loadingProgressao) {
            setLoading(false);
        }
    }, [id, progressao, etapas, loadingProgressao, isDirigente]);

    // Limpar o timeout ao desmontar o componente
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Função para criar uma nova progressão
    const criarProgressao = async (nextEtapaId) => {
        try {
            const today = new Date().toISOString();
            const response = await api.post(`/progressoDoEscuteiro`, {
                escuteiroId: parseInt(id),
                estagioDoProgressoId: nextEtapaId,
                dataDeProgresso: today
            });
            
            return response.data;
        } catch (error) {
            console.error('Erro ao criar progressão:', error);
            throw error;
        }
    };

    // Função para atualizar uma progressão existente
    const atualizarProgressao = async (progressaoId, nextEtapaId) => {
        try {
            const today = new Date().toISOString();
            const response = await api.patch(`/progressoDoEscuteiro/${id}`, {
                id: progressaoId,
                escuteiroId: parseInt(id),
                estagioDoProgressoId: nextEtapaId,
                dataDeProgresso: today
            });
            
            return response.data;
        } catch (error) {
            console.error('Erro ao atualizar progressão:', error);
            throw error;
        }
    };

    const handleProgressao = async () => {
        try {
            if (isDirigente) {
                showToast('warning', 'Aviso', 'Dirigentes não possuem progressão');
                return;
            }

            // Calcular próximo número de etapa
            const currentEtapaNumber = parseInt(currentEtapa) || 0;
            const nextEtapaNumber = currentEtapaNumber + 1;

            // Verificação de etapa máxima
            if (nextEtapaNumber > 4) {
                showToast('warning', 'Aviso', 'Já está na etapa máxima');
                return;
            }

            // Encontrar a próxima etapa pelo número
            const nextEtapa = etapas.find(e => e.etapa === nextEtapaNumber);
            if (!nextEtapa) {
                showToast('error', 'Erro', 'Etapa não encontrada');
                return;
            }

            // Verificar se o escuteiro já tem uma progressão registrada
            const escuteiroProgressao = progressao.find(p => p.escuteiro_id === parseInt(id));
            
            let result;
            if (escuteiroProgressao) {
                // Atualizar progressão existente
                result = await atualizarProgressao(escuteiroProgressao.id, nextEtapa.id);
            } else {
                // Criar nova progressão
                result = await criarProgressao(nextEtapa.id);
            }

            // Atualizar estado local
            setCurrentEtapa(nextEtapaNumber);
            
            // Atualizar dados de progressão
            if (refetchProgressao) {
                await refetchProgressao();
            }

            showToast('success', 'Sucesso', 'Progressão atualizada com sucesso!');
            setShowConfirmModal(false);

            // Pequeno atraso para mostrar o toast antes do reload
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (error) {
            console.error('Erro ao processar progressão:', error);

            let errorMessage = 'Erro ao atualizar progressão';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.message) {
                errorMessage = `${errorMessage}: ${error.message}`;
            }

            showToast('error', 'Erro', errorMessage);
        }
    };

    if (loading || loadingProgressao) {
        return (
            <div className="p-6 max-w-6xl mx-auto space-y-4">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-64 rounded-xl" />
            </div>
        );
    }

    if (!scoutDetails) return null;

    return (
        <div className="min-h-full">
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho do Escuteiro */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={!imageError ? getImageUrl(scoutDetails.id) : '/assets/placeholder-profile.png'}
                                    alt={scoutDetails.nome}
                                    className="w-32 h-32 md:w-40 md:h-40 lg:w-52 lg:h-52 rounded-full object-cover border-4 border-white shadow-md"
                                    onError={() => setImageError(true)}
                                />
                                {!isDirigente && currentEtapa > 0 && (
                                    <div className="absolute bottom-0 right-0 bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-md">
                                        {currentEtapa}
                                    </div>
                                )}
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{scoutDetails.nome}</h1>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 shadow-sm">
                                        {scoutDetails.categoria}
                                    </span>
                                    {scoutDetails.secao && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                                            {scoutDetails.secao}
                                        </span>
                                    )}
                                    {!isDirigente && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 shadow-sm">
                                            Etapa Atual: {currentEtapa || 'Inicial'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensagem para Dirigentes */}
                {isDirigente ? (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 md:p-8 border border-gray-100">
                        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
                            <Info className="h-6 w-6 text-blue-500" />
                            <p className="text-blue-700">
                                Os Dirigentes não possuem sistema de progressão, pois são responsáveis por orientar e acompanhar o desenvolvimento dos outros escuteiros.
                            </p>
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Papel do Dirigente</h3>
                        
                        <p className="text-gray-600 mb-4">
                            Como Dirigente, seu papel é fundamental para:
                        </p>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="font-medium text-gray-800 mb-2">Acompanhamento</h4>
                                <p className="text-gray-600 text-sm">
                                    Acompanhar e avaliar a progressão dos escuteiros, dando feedback construtivo e encorajamento.
                                </p>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="font-medium text-gray-800 mb-2">Orientação</h4>
                                <p className="text-gray-600 text-sm">
                                    Orientar e motivar o desenvolvimento pessoal de cada escuteiro, ajudando-os a superar desafios.
                                </p>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="font-medium text-gray-800 mb-2">Atividades</h4>
                                <p className="text-gray-600 text-sm">
                                    Organizar e conduzir atividades educativas que contribuam para o desenvolvimento dos escuteiros.
                                </p>
                            </div>
                            
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <h4 className="font-medium text-gray-800 mb-2">Qualidade</h4>
                                <p className="text-gray-600 text-sm">
                                    Garantir a qualidade do programa educativo e a coerência com os valores do escutismo.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Timeline de Progressão - Para não-dirigentes */
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                        <div className="p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Progressão</h2>
                                
                                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-sm text-blue-700 font-medium">
                                        {currentEtapa === 0 ? 'Inicial' : `Etapa ${currentEtapa} de 4`}
                                    </span>
                                </div>
                            </div>

                            <div className="relative mb-12">
                                {/* Linha de Progresso */}
                                <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2">
                                    <div
                                        className="h-full bg-green-500 rounded-full transition-all duration-500 shadow-sm"
                                        style={{ width: `${(currentEtapa / 4) * 100}%` }}
                                    />
                                </div>

                                {/* Etapas */}
                                <div className="relative flex justify-between">
                                    {etapas.map((etapa) => (
                                        <div
                                            key={etapa.id}
                                            className={`flex flex-col items-center ${etapa.etapa <= currentEtapa ? 'opacity-100' : 'opacity-60'}`}
                                        >
                                            <div 
                                                className={`
                                                    w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                                                    ${etapa.etapa <= currentEtapa 
                                                        ? 'bg-green-500 text-white shadow-md' 
                                                        : 'bg-gray-200 text-gray-500'}
                                                    mb-4 relative z-10 border-2 border-white
                                                    transition-all duration-300
                                                `}
                                            >
                                                {etapa.etapa}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cards das Etapas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                {etapas.map((etapa) => (
                                    <div 
                                        key={etapa.id}
                                        className={`
                                            p-4 rounded-xl border transition-all duration-300
                                            ${etapa.etapa <= currentEtapa 
                                                ? 'border-green-200 bg-green-50' 
                                                : 'border-gray-200 bg-gray-50'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div 
                                                className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center text-sm
                                                    ${etapa.etapa <= currentEtapa 
                                                        ? 'bg-green-500 text-white' 
                                                        : 'bg-gray-300 text-gray-600'}
                                                `}
                                            >
                                                {etapa.etapa}
                                            </div>
                                            <h3 className="font-semibold text-gray-800">
                                                {etapa.nomeDaEtapa || `Etapa ${etapa.etapa}`}
                                            </h3>
                                        </div>
                                        
                                        <div className="flex justify-center mb-3">
                                            <img
                                                src={getEtapaImageUrl(etapa.id)}
                                                alt={`Etapa ${etapa.etapa}`}
                                                className="w-20 h-20 object-contain"
                                                onError={(e) => {
                                                    e.target.src = `/assets/etapa${etapa.etapa}.png`;
                                                }}
                                            />
                                        </div>
                                        
                                        {etapa.etapa === currentEtapa && (
                                            <div className="mt-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded text-center">
                                                Etapa atual
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Botão de Progressão */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => setShowConfirmModal(true)}
                                    disabled={currentEtapa >= 4}
                                    className={`
                                        px-6 py-3 rounded-xl text-white font-medium shadow-md
                                        ${currentEtapa >= 4
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-green-500 hover:bg-green-600 transition-colors'}
                                    `}
                                >
                                    {currentEtapa >= 4
                                        ? 'Progressão Concluída'
                                        : `Avançar para ${currentEtapa === 0 ? 'Primeira Etapa' : `Etapa ${currentEtapa + 1}`}`}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Confirmação */}
            {showConfirmModal && !isDirigente && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-200 animate-slide-up">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                            Confirmar Progressão
                        </h3>
                        
                        <div className="mb-6 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
                            <p className="text-amber-800">
                                Tem certeza que deseja avançar o escuteiro{' '}
                                <span className="font-semibold">{scoutDetails.nome}</span> para a{' '}
                                <span className="font-semibold">
                                    {currentEtapa === 0 ? 'primeira etapa' : `etapa ${currentEtapa + 1}`}
                                </span>?
                            </p>
                            <p className="text-amber-800 mt-2 text-sm">
                                Esta ação não pode ser desfeita.
                            </p>
                        </div>
                        
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleProgressao}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProgressaoEscuteiro;