import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useScout } from '../../hooks/useScoutData';
import { Calendar, FileText, AlertCircle, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import CustomInput from '../../components/CustomInput';
import api from '../../services/api';

const ProcessoDisciplinar = () => {
    const BASE_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';
    const { id } = useParams();
    const navigate = useNavigate();
    const { scout, loading: loadingScout } = useScout();
    
    // Estados
    const [formData, setFormData] = useState({
        motivo: '',
        estado: '',
        dataDeEntradaDisciplina: new Date(), // Inicializado com objeto Date
        dataDeSaidaDisciplina: null, // Null em vez de string vazia
        escuteiroId: parseInt(id)
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [disciplinas, setDisciplinas] = useState([]);
    const [loadingDisciplinas, setLoadingDisciplinas] = useState(true);
    const [imageError, setImageError] = useState(false);
    
    // Escuteiro atual
    const scoutDetails = scout?.find(s => s?.id?.toString() === id);
    
    // Opções para o estado da disciplina
    const estadoOptions = [
        { label: 'Advertido', value: 'Advertido' },
        { label: 'Suspenso', value: 'Suspenso' },
        { label: 'Expulso', value: 'Expulso' },
        { label: 'Em Observação', value: 'Em Observação' },
        { label: 'Cumprido', value: 'Cumprido' }
    ];
    
    // Carregar disciplinas existentes
    const fetchDisciplinas = useCallback(async () => {
        try {
            setLoadingDisciplinas(true);
            const response = await api.get(`/disciplina/all`);
            setDisciplinas(response.data);
        } catch (error) {
            console.error('Erro ao carregar disciplinas:', error);
            showToast('error', 'Erro', 'Não foi possível carregar o histórico disciplinar');
        } finally {
            setLoadingDisciplinas(false);
        }
    }, [id]);
    
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
    
    // Inicialização
    useEffect(() => {
        // Inicializar com objeto Date real, não string
        const hoje = new Date();
        
        setFormData(prev => ({
            ...prev,
            dataDeEntradaDisciplina: hoje
        }));
        
        fetchDisciplinas();
    }, [id, fetchDisciplinas]);
    
    // Limpar timeout ao desmontar
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);
    
    // Handler para mudança nos campos
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Limpar erro se o campo foi preenchido
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };
    
    // Validação do formulário
    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['motivo', 'estado', 'dataDeEntradaDisciplina'];
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                newErrors[field] = `O campo ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} é obrigatório`;
            }
        });
        
        // Validação específica para datas
        if (formData.dataDeEntradaDisciplina && formData.dataDeSaidaDisciplina) {
            const entrada = new Date(formData.dataDeEntradaDisciplina);
            const saida = new Date(formData.dataDeSaidaDisciplina);
            
            if (saida < entrada) {
                newErrors.dataDeSaidaDisciplina = 'A data de saída deve ser posterior à data de entrada';
            }
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    // Função para formatar a data para exibição
    const formatarData = (dataStr) => {
        if (!dataStr) return '';
        
        try {
            const data = new Date(dataStr);
            return data.toLocaleDateString('pt-BR');
        } catch (error) {
            console.error('Erro ao formatar data:', error);
            return dataStr;
        }
    };
    
    // Função para obter cor com base no estado
    const getEstadoColor = (estado) => {
        switch (estado) {
            case 'Advertido':
                return 'bg-yellow-100 text-yellow-800';
            case 'Suspenso':
                return 'bg-red-100 text-red-800';
            case 'Expulso':
                return 'bg-blue-500 text-white';
            case 'Em Observação':
                return 'bg-blue-100 text-blue-800';
            case 'Cumprido':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    
    // Função para enviar o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        
        if (!validateForm()) {
            showToast('error', 'Formulário Incompleto', 'Verifique os campos destacados em vermelho');
            return;
        }
        
        setLoading(true);
        try {
            // Preparar payload com as conversões corretas de datas
            const payload = {
                motivo: formData.motivo.trim(),
                estado: formData.estado.value || formData.estado,
                // Converter objetos Date para o formato ISO string que a API espera
                dataDeEntradaDisciplina: formData.dataDeEntradaDisciplina instanceof Date 
                    ? formData.dataDeEntradaDisciplina.toISOString().split('T')[0]
                    : formData.dataDeEntradaDisciplina,
                dataDeSaidaDisciplina: formData.dataDeSaidaDisciplina instanceof Date 
                    ? formData.dataDeSaidaDisciplina.toISOString().split('T')[0] 
                    : formData.dataDeSaidaDisciplina,
                escuteiroId: parseInt(id)
            };
            
            // Enviar para API
            await api.post('/disciplina', payload);
            
            showToast('success', 'Sucesso', 'Processo disciplinar registrado com sucesso');
            
            // Resetar formulário e recarregar disciplinas
            setFormData({
                motivo: '',
                estado: '',
                dataDeEntradaDisciplina: new Date(), // Usar objeto Date
                dataDeSaidaDisciplina: null,
                escuteiroId: parseInt(id)
            });
            setSubmitted(false);
            fetchDisciplinas();
        } catch (error) {
            console.error('Erro ao registrar disciplina:', error);
            
            let errorMessage = 'Erro ao registrar processo disciplinar';
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = `${errorMessage}: ${error.message}`;
            }
            
            showToast('error', 'Erro', errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // Função para voltar
    const handleVoltar = () => {
        navigate(-1);
    };
    
    // Função para obter URL da imagem
    const getImageUrl = (escuteiroId) => {
        if (!escuteiroId || imageError) return '/assets/placeholder-profile.png';
        return `${BASE_URL}/escuteiro/${id}/imagem`;
    };
    
    // Se estiver carregando escuteiro
    if (loadingScout) {
        return (
            <div className="min-h-full  flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
                <span className="ml-3 text-purple-600 font-medium">Carregando...</span>
            </div>
        );
    }
    
    // Se não encontrou escuteiro
    if (!scoutDetails) {
        return (
            <div className="min-h-full  flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                    <div className="flex flex-col items-center text-center">
                        <AlertCircle className="h-16 w-16 text-blue-500 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Escuteiro não encontrado</h2>
                        <p className="text-gray-600 mb-6">Não foi possível encontrar os dados do escuteiro solicitado.</p>
                        <button
                            onClick={handleVoltar}
                            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition-all"
                        >
                            <ChevronLeft size={18} />
                            Voltar
                        </button>
                    </div>
                </div>
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
            
            <div className="max-w-6xl mx-auto">
                {/* Cabeçalho com dados do escuteiro */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 border border-gray-100">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={getImageUrl(scoutDetails.id)}
                                    alt={scoutDetails.nome}
                                    className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-white shadow-md"
                                    onError={() => setImageError(true)}
                                />
                            </div>
                            <div className="text-center md:text-left flex-1">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{scoutDetails.nome}</h1>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 shadow-sm">
                                        {scoutDetails.categoria}
                                    </span>
                                    {scoutDetails.secao && (
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 shadow-sm">
                                            {scoutDetails.secao || 'olaa'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <button
                                    onClick={handleVoltar}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    <ChevronLeft size={18} />
                                    Voltar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Formulário para registro de disciplina */}
                    <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-purple-600" />
                            Registrar Processo Disciplinar
                        </h2>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-6">
                                {/* Motivo */}
                                <CustomInput
                                    type="textarea"
                                    label="Motivo"
                                    value={formData.motivo}
                                    onChange={(value) => handleInputChange('motivo', value)}
                                    required
                                    placeholder="Descreva o motivo do processo disciplinar"
                                    errorMessage={submitted && errors.motivo}
                                    disabled={loading}
                                    rows={4}
                                />
                                
                                {/* Estado */}
                                <CustomInput
                                    type="select"
                                    label="Estado"
                                    value={formData.estado}
                                    onChange={(value) => handleInputChange('estado', value)}
                                    options={estadoOptions}
                                    required
                                    placeholder="Selecione o estado do processo"
                                    errorMessage={submitted && errors.estado}
                                    disabled={loading}
                                />
                                
                                {/* Data de Entrada */}
                                <CustomInput
                                    type="date"
                                    label="Data de Entrada"
                                    value={formData.dataDeEntradaDisciplina}
                                    onChange={(value) => handleInputChange('dataDeEntradaDisciplina', value)}
                                    required
                                    errorMessage={submitted && errors.dataDeEntradaDisciplina}
                                    disabled={loading}
                                    iconStart={<Calendar size={18} />}
                                    placeholder="Selecione a data"
                                    helperText="Data de início do processo disciplinar"
                                />
                                
                                {/* Data de Saída */}
                                <CustomInput
                                    type="date"
                                    label="Data de Saída"
                                    value={formData.dataDeSaidaDisciplina}
                                    onChange={(value) => handleInputChange('dataDeSaidaDisciplina', value)}
                                    errorMessage={submitted && errors.dataDeSaidaDisciplina}
                                    disabled={loading}
                                    iconStart={<Calendar size={18} />}
                                    placeholder="Selecione a data"
                                    helperText="Data prevista para término do processo (opcional)"
                                />
                                
                                {/* Botão de Salvar */}
                                <div className="mt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2 disabled:bg-purple-300 shadow-md"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                                <span>Processando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={18} />
                                                <span>Registrar Disciplina</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    
                    {/* Histórico de Disciplinas */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-purple-600" />
                            Histórico Disciplinar
                        </h2>
                        
                        {loadingDisciplinas ? (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent"></div>
                            </div>
                        ) : disciplinas.length > 0 ? (
                            <div className="space-y-4">
                                {disciplinas.map((disciplina, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${getEstadoColor(disciplina.estado)}`}>
                                                {disciplina.estado}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {formatarData(disciplina.dataDeEntradaDisciplina)}
                                                {disciplina.dataDeSaidaDisciplina && ` até ${formatarData(disciplina.dataDeSaidaDisciplina)}`}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-800 mt-2">
                                            {disciplina.motivo}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className=" rounded-lg p-6 text-center">
                                <p className="text-gray-600">
                                    Nenhum registro disciplinar encontrado.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessoDisciplinar;