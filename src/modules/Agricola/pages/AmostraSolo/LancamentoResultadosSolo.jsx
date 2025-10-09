import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Beaker,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Leaf,
    Loader,
    MapPin,
    Save,
    Search,
    TestTube,
    Upload,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../core/components/CustomInput';

const LancamentoResultadosSolo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const amostraId = id;

    const API_BASE_URL = 'https://mwangobrainsa-001-site2.mtempurl.com/api';

    const [activeIndex, setActiveIndex] = useState(amostraId ? 1 : 0);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    const [amostraSelecionada, setAmostraSelecionada] = useState(null);
    const [amostrasDisponiveis, setAmostrasDisponiveis] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    const initialState = {
        // Identificação da Amostra
        amostraId: amostraId || '',
        dataAnalise: new Date().toISOString().split('T')[0],
        laboratorio: '',
        tecnicoResponsavel: '',

        // Parâmetros Físicos
        ph: '',
        condutividadeEletrica: '',
        materiaOrganica: '',
        umidade: '',
        densidade: '',
        porosidade: '',

        // Macronutrientes (mg/kg)
        nitrogenio: '',
        fosforo: '',
        potassio: '',
        calcio: '',
        magnesio: '',
        enxofre: '',

        // Micronutrientes (mg/kg)
        ferro: '',
        manganes: '',
        zinco: '',
        cobre: '',
        boro: '',
        molibdenio: '',

        // Análise Complementar
        capacidadeTrocaCationica: '',
        saturacaoBases: '',
        somaBases: '',
        relacaoCN: '',
        aluminio: '',
        acidezTrocavel: '',

        // Classificação e Recomendações
        classificacaoFertilidade: '',
        recomendacoesCalcario: '',
        recomendacoesFertilizante: '',
        culturasRecomendadas: [],
        observacoes: '',

        // Anexos
        resultadosLaboratorio: null
    };

    const [formData, setFormData] = useState(initialState);

    const steps = [
        { label: 'Seleção Amostra', icon: Search },
        { label: 'Análises Físicas', icon: Beaker },
        { label: 'Nutrientes', icon: Activity },
        { label: 'Recomendações', icon: CheckCircle }
    ];

    // Carregar todas as amostras disponíveis
    useEffect(() => {
        carregarAmostras();
    }, []);

    // Se recebeu ID, carrega a amostra automaticamente
    useEffect(() => {
        if (amostraId) {
            carregarAmostra(amostraId);
        }
    }, [amostraId]);

    const carregarAmostras = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/testeDeAmostraDeSolo/all`);
            if (!response.ok) throw new Error('Erro ao carregar amostras');

            const data = await response.json();
            setAmostrasDisponiveis(data);
        } catch (error) {
            console.error('Erro ao carregar amostras:', error);
            showToast('error', 'Erro', 'Não foi possível carregar as amostras disponíveis');
        } finally {
            setLoading(false);
        }
    };

    const carregarAmostra = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/testeDeAmostraDeSolo/${id}`);
            if (!response.ok) throw new Error('Amostra não encontrada');

            const amostra = await response.json();
            setAmostraSelecionada(amostra);
            setFormData(prev => ({ ...prev, amostraId: id }));
            showToast('success', 'Amostra carregada', 'Dados da amostra carregados com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar amostra:', error);
            showToast('error', 'Erro', 'Amostra não encontrada');
        } finally {
            setLoading(false);
        }
    };

    const handleSelecionarAmostra = (amostra) => {
        setAmostraSelecionada(amostra);
        setFormData(prev => ({ ...prev, amostraId: amostra.id }));
        setActiveIndex(1);
        showToast('success', 'Amostra selecionada', `Amostra ${amostra.numeroAmostra || amostra.id} selecionada`);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const showToast = (type, title, message) => {
        setToastMessage({ type, title, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Criar FormData para enviar como multipart/form-data
            const formDataToSend = new FormData();

            // Adicionar campos obrigatórios e opcionais
            formDataToSend.append('DataDaAnalise', formData.dataAnalise);
            formDataToSend.append('NomeDoLaboratorio', formData.laboratorio);
            formDataToSend.append('TecnicoResponsavel', formData.tecnicoResponsavel);
            formDataToSend.append('AmostraDeSoloId', formData.amostraId);

            // Parâmetros Físicos
            if (formData.ph) formDataToSend.append('pH', parseFloat(formData.ph));
            if (formData.condutividadeEletrica) formDataToSend.append('CondutividadeEletrica', parseFloat(formData.condutividadeEletrica));
            if (formData.materiaOrganica) formDataToSend.append('MateriaOrganica', parseFloat(formData.materiaOrganica));
            if (formData.umidade) formDataToSend.append('Humidade', parseFloat(formData.umidade));
            if (formData.densidade) formDataToSend.append('Densidade', parseFloat(formData.densidade));
            if (formData.porosidade) formDataToSend.append('Porosidade', parseFloat(formData.porosidade));

            // Análise Complementar
            if (formData.capacidadeTrocaCationica) formDataToSend.append('CapacidadeDeTrocaCationica', parseFloat(formData.capacidadeTrocaCationica));
            if (formData.saturacaoBases) formDataToSend.append('SaturaçãoPorBases', parseFloat(formData.saturacaoBases));
            if (formData.somaBases) formDataToSend.append('SomaDeBases', parseFloat(formData.somaBases));
            if (formData.relacaoCN) formDataToSend.append('Relacao', parseFloat(formData.relacaoCN));
            if (formData.aluminio) formDataToSend.append('Aluminio', parseFloat(formData.aluminio));
            if (formData.acidezTrocavel) formDataToSend.append('AcidezTrocavel', parseFloat(formData.acidezTrocavel));

            // Macronutrientes
            if (formData.nitrogenio) formDataToSend.append('Nitrogenio', parseFloat(formData.nitrogenio));
            if (formData.fosforo) formDataToSend.append('Fosforo', parseFloat(formData.fosforo));
            if (formData.potassio) formDataToSend.append('Potassio', parseFloat(formData.potassio));
            if (formData.calcio) formDataToSend.append('Calcio', parseFloat(formData.calcio));
            if (formData.magnesio) formDataToSend.append('Magnesio', parseFloat(formData.magnesio));
            if (formData.enxofre) formDataToSend.append('Enxofre', parseFloat(formData.enxofre));

            // Micronutrientes
            if (formData.ferro) formDataToSend.append('Ferro', parseFloat(formData.ferro));
            if (formData.manganes) formDataToSend.append('Manganes', parseFloat(formData.manganes));
            if (formData.zinco) formDataToSend.append('Zinco', parseFloat(formData.zinco));
            if (formData.cobre) formDataToSend.append('Cobre', parseFloat(formData.cobre));
            if (formData.boro) formDataToSend.append('Boro', parseFloat(formData.boro));
            if (formData.molibdenio) formDataToSend.append('Molibdenio', parseFloat(formData.molibdenio));

            // Recomendações
            if (formData.classificacaoFertilidade)
                formDataToSend.append('ClassificacaoDaFertilidade', formData.classificacaoFertilidade.value);
            if (formData.recomendacoesCalcario) formDataToSend.append('RecomendacoesDeCalagem', formData.recomendacoesCalcario);
            if (formData.recomendacoesFertilizante) formDataToSend.append('RecomendacoesDeFertilizacao', formData.recomendacoesFertilizante);
            if (formData.observacoes) formDataToSend.append('ObservacoesGerais', formData.observacoes);

            // Culturas Recomendadas (array)
            if (formData.culturasRecomendadas && formData.culturasRecomendadas.length > 0) {
                formData.culturasRecomendadas.forEach((cultura, index) => {
                    formDataToSend.append(`CulturasRecomendadas[${index}]`, cultura.value);
                });
            }


            // Anexo de arquivo
            if (formData.resultadosLaboratorio && formData.resultadosLaboratorio.length > 0) {
                formDataToSend.append('AnexarResultadosDoLaboratorio', formData.resultadosLaboratorio[0]);
            }

            const response = await fetch(`${API_BASE_URL}/analise`, {
                method: 'POST',
                body: formDataToSend
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(errorData || 'Erro ao salvar resultados');
            }

            showToast('success', 'Sucesso', 'Resultados registrados com sucesso!');

            // Resetar formulário após salvar
            setTimeout(() => {
                setFormData(initialState);
                setAmostraSelecionada(null);
                setActiveIndex(amostraId ? 1 : 0);
                if (!amostraId) {
                    carregarAmostras(); // Recarregar lista de amostras
                }
            }, 2000);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro', error.message || 'Erro ao registrar resultados. Tente novamente.');
        } finally {
            setSaving(false);
        }
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
            default:
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
                icon = <AlertCircle className="w-5 h-5" />;
        }

        return (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor}`}>
                <div className="flex items-center">
                    <div className="mr-3">{icon}</div>
                    <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                    <button
                        className="ml-auto p-1 hover:bg-gray-200 rounded-full"
                        onClick={() => setToastMessage(null)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Seleção da Amostra
                return (
                    <div className="max-w-6xl mx-auto">
                        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-6 mb-8 border border-emerald-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Search className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Selecionar Amostra para Análise</h3>
                            </div>
                            <p className="text-gray-600">Escolha a amostra de solo para registrar os resultados das análises laboratoriais.</p>
                        </div>

                        {/* Barra de Pesquisa */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                            <CustomInput
                                type="text"
                                placeholder="Pesquisar por código, número ou localização..."
                                value={searchTerm}
                                onChange={setSearchTerm}
                            />
                        </div>

                        {/* Lista de Amostras */}
                        {loading ? (
                            <div className="text-center py-12">
                                <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                                <p className="text-gray-600">Carregando amostras...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {amostrasDisponiveis
                                    .filter(a => {
                                        const termo = searchTerm.toLowerCase();
                                        return (
                                            (a.numeroAmostra && a.numeroAmostra.toLowerCase().includes(termo)) ||
                                            (a.codigoAmostra && a.codigoAmostra.toLowerCase().includes(termo)) ||
                                            (a.localizacao?.provincia && a.localizacao.provincia.toLowerCase().includes(termo)) ||
                                            (a.provincia && a.provincia.toLowerCase().includes(termo)) ||
                                            String(a.id).includes(termo)
                                        );
                                    })
                                    .map(amostra => (
                                        <div
                                            key={amostra.id}
                                            className="bg-white rounded-xl border-2 border-gray-200 hover:border-emerald-500 p-6 cursor-pointer transition-all hover:shadow-lg"
                                            onClick={() => handleSelecionarAmostra(amostra)}
                                        >
                                            <div className="flex items-center mb-4">
                                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <TestTube className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <div className="ml-3">
                                                    <h4 className="font-semibold text-gray-900">
                                                        {amostra.numeroAmostra || `Amostra #${amostra.id}`}
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        {amostra.codigoAmostra || `Código: ${amostra.id}`}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-2 text-sm">
                                                {(amostra.localizacao?.municipio || amostra.municipio) && (
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="w-4 h-4 mr-2" />
                                                        {amostra.localizacao?.municipio || amostra.municipio}, {amostra.localizacao?.provincia || amostra.provincia}
                                                    </div>
                                                )}
                                                {(amostra.dataColeta || amostra.dataDeColeta) && (
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="w-4 h-4 mr-2" />
                                                        Coleta: {new Date(amostra.dataColeta || amostra.dataDeColeta).toLocaleDateString('pt-BR')}
                                                    </div>
                                                )}
                                                {(amostra.culturaAtual || amostra.cultura) && (
                                                    <div className="flex items-center text-gray-600">
                                                        <Leaf className="w-4 h-4 mr-2" />
                                                        {amostra.culturaAtual || amostra.cultura}
                                                    </div>
                                                )}
                                                <div className="mt-3 pt-3 border-t">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${(amostra.statusAnalise || amostra.status) === 'PENDENTE'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {(amostra.statusAnalise || amostra.status) === 'PENDENTE' ? 'Pendente' : 'Em Análise'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}

                        {!loading && amostrasDisponiveis.filter(a =>
                            (a.numeroAmostra && a.numeroAmostra.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (a.codigoAmostra && a.codigoAmostra.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            String(a.id).includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                                <div className="text-center py-12">
                                    <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">Nenhuma amostra encontrada</p>
                                </div>
                            )}
                    </div>
                );

            case 1: // Análises Físicas
                return (
                    <div className="max-w-4xl mx-auto">
                        {/* Informações da Amostra Selecionada */}


                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Beaker className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Parâmetros Físico-Químicos</h3>
                            </div>
                            <p className="text-gray-600">Resultados das análises físicas e químicas do solo.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Dados da Análise */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Dados da Análise</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="date"
                                        label="Data da Análise"
                                        value={formData.dataAnalise}
                                        onChange={(value) => handleInputChange('dataAnalise', value)}
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Laboratório"
                                        value={formData.laboratorio}
                                        onChange={(value) => handleInputChange('laboratorio', value)}
                                        placeholder="Nome do laboratório"
                                        required
                                    />
                                    <CustomInput
                                        type="text"
                                        label="Técnico Responsável"
                                        value={formData.tecnicoResponsavel}
                                        onChange={(value) => handleInputChange('tecnicoResponsavel', value)}
                                        placeholder="Nome do técnico"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Parâmetros Físicos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Parâmetros Físicos</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="pH"
                                        value={formData.ph}
                                        onChange={(value) => handleInputChange('ph', value)}
                                        placeholder="Ex: 6.5"
                                        step="0.1"
                                        helperText="Escala de 0 a 14"
                                        required
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Condutividade Elétrica (dS/m)"
                                        value={formData.condutividadeEletrica}
                                        onChange={(value) => handleInputChange('condutividadeEletrica', value)}
                                        placeholder="Ex: 0.5"
                                        step="0.01"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Matéria Orgânica (%)"
                                        value={formData.materiaOrganica}
                                        onChange={(value) => handleInputChange('materiaOrganica', value)}
                                        placeholder="Ex: 3.2"
                                        step="0.1"
                                        required
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Humidade (%)"
                                        value={formData.umidade}
                                        onChange={(value) => handleInputChange('umidade', value)}
                                        placeholder="Ex: 15.5"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Densidade (g/cm³)"
                                        value={formData.densidade}
                                        onChange={(value) => handleInputChange('densidade', value)}
                                        placeholder="Ex: 1.3"
                                        step="0.01"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Porosidade (%)"
                                        value={formData.porosidade}
                                        onChange={(value) => handleInputChange('porosidade', value)}
                                        placeholder="Ex: 45"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            {/* Análise Complementar */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Análise Complementar</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="CTC - Capacidade de Troca Catiônica (cmolc/dm³)"
                                        value={formData.capacidadeTrocaCationica}
                                        onChange={(value) => handleInputChange('capacidadeTrocaCationica', value)}
                                        placeholder="Ex: 8.5"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Saturação por Bases (%)"
                                        value={formData.saturacaoBases}
                                        onChange={(value) => handleInputChange('saturacaoBases', value)}
                                        placeholder="Ex: 65"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Soma de Bases (cmolc/dm³)"
                                        value={formData.somaBases}
                                        onChange={(value) => handleInputChange('somaBases', value)}
                                        placeholder="Ex: 5.5"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Relação C/N"
                                        value={formData.relacaoCN}
                                        onChange={(value) => handleInputChange('relacaoCN', value)}
                                        placeholder="Ex: 12"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Alumínio (cmolc/dm³)"
                                        value={formData.aluminio}
                                        onChange={(value) => handleInputChange('aluminio', value)}
                                        placeholder="Ex: 0.3"
                                        step="0.01"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Acidez Trocável (cmolc/dm³)"
                                        value={formData.acidezTrocavel}
                                        onChange={(value) => handleInputChange('acidezTrocavel', value)}
                                        placeholder="Ex: 0.5"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Nutrientes
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Análise de Nutrientes</h3>
                            </div>
                            <p className="text-gray-600">Concentrações de macro e micronutrientes no solo.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Macronutrientes */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Macronutrientes (mg/kg)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Nitrogênio (N)"
                                        value={formData.nitrogenio}
                                        onChange={(value) => handleInputChange('nitrogenio', value)}
                                        placeholder="Ex: 120"
                                        step="0.1"
                                        required
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Fósforo (P)"
                                        value={formData.fosforo}
                                        onChange={(value) => handleInputChange('fosforo', value)}
                                        placeholder="Ex: 25"
                                        step="0.1"
                                        required
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Potássio (K)"
                                        value={formData.potassio}
                                        onChange={(value) => handleInputChange('potassio', value)}
                                        placeholder="Ex: 85"
                                        step="0.1"
                                        required
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Cálcio (Ca)"
                                        value={formData.calcio}
                                        onChange={(value) => handleInputChange('calcio', value)}
                                        placeholder="Ex: 150"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Magnésio (Mg)"
                                        value={formData.magnesio}
                                        onChange={(value) => handleInputChange('magnesio', value)}
                                        placeholder="Ex: 45"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Enxofre (S)"
                                        value={formData.enxofre}
                                        onChange={(value) => handleInputChange('enxofre', value)}
                                        placeholder="Ex: 12"
                                        step="0.1"
                                    />
                                </div>
                            </div>

                            {/* Micronutrientes */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Micronutrientes (mg/kg)</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Ferro (Fe)"
                                        value={formData.ferro}
                                        onChange={(value) => handleInputChange('ferro', value)}
                                        placeholder="Ex: 25"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Manganês (Mn)"
                                        value={formData.manganes}
                                        onChange={(value) => handleInputChange('manganes', value)}
                                        placeholder="Ex: 8.5"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Zinco (Zn)"
                                        value={formData.zinco}
                                        onChange={(value) => handleInputChange('zinco', value)}
                                        placeholder="Ex: 2.1"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Cobre (Cu)"
                                        value={formData.cobre}
                                        onChange={(value) => handleInputChange('cobre', value)}
                                        placeholder="Ex: 1.5"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Boro (B)"
                                        value={formData.boro}
                                        onChange={(value) => handleInputChange('boro', value)}
                                        placeholder="Ex: 0.8"
                                        step="0.1"
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Molibdênio (Mo)"
                                        value={formData.molibdenio}
                                        onChange={(value) => handleInputChange('molibdenio', value)}
                                        placeholder="Ex: 0.2"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Recomendações
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Interpretação e Recomendações</h3>
                            </div>
                            <p className="text-gray-600">Classificação da fertilidade e recomendações técnicas.</p>
                        </div>

                        <div className="space-y-8">
                            {/* Classificação */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Classificação</h4>
                                <CustomInput
                                    type="select"
                                    label="Classificação da Fertilidade"
                                    value={formData.classificacaoFertilidade}
                                    options={[
                                        { label: "Muito Baixa", value: "muito_baixa" },
                                        { label: "Baixa", value: "baixa" },
                                        { label: "Média", value: "media" },
                                        { label: "Alta", value: "alta" },
                                        { label: "Muito Alta", value: "muito_alta" }
                                    ]}
                                    onChange={(value) => handleInputChange('classificacaoFertilidade', value)}
                                    required
                                />
                            </div>

                            {/* Recomendações */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Recomendações Técnicas</h4>
                                <div className="space-y-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Recomendações de Calagem"
                                        value={formData.recomendacoesCalcario}
                                        onChange={(value) => handleInputChange('recomendacoesCalcario', value)}
                                        placeholder="Tipo e quantidade de calcário recomendado, método de aplicação..."
                                        rows={3}
                                    />
                                    <CustomInput
                                        type="textarea"
                                        label="Recomendações de Fertilização"
                                        value={formData.recomendacoesFertilizante}
                                        onChange={(value) => handleInputChange('recomendacoesFertilizante', value)}
                                        placeholder="Fertilizantes e dosagens recomendadas por cultura..."
                                        rows={4}
                                    />
                                    <CustomInput
                                        type="multiselect"
                                        label="Culturas Recomendadas"
                                        value={formData.culturasRecomendadas}
                                        options={[
                                            { label: "Milho", value: "milho" },
                                            { label: "Feijão", value: "feijao" },
                                            { label: "Soja", value: "soja" },
                                            { label: "Arroz", value: "arroz" },
                                            { label: "Batata-doce", value: "batata_doce" },
                                            { label: "Mandioca", value: "mandioca" },
                                            { label: "Tomate", value: "tomate" },
                                            { label: "Cebola", value: "cebola" },
                                            { label: "Couve", value: "couve" },
                                            { label: "Café", value: "cafe" },
                                            { label: "Banana", value: "banana" }
                                        ]}
                                        onChange={(value) => handleInputChange('culturasRecomendadas', value)}
                                    />
                                    <CustomInput
                                        type="textarea"
                                        label="Observações Gerais"
                                        value={formData.observacoes}
                                        onChange={(value) => handleInputChange('observacoes', value)}
                                        placeholder="Observações adicionais sobre a análise e recomendações específicas..."
                                        rows={4}
                                    />
                                </div>
                            </div>

                            {/* Anexos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Anexar Resultados do Laboratório</h4>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                        onChange={(e) => handleInputChange('resultadosLaboratorio', e.target.files)}
                                        id="resultados-upload"
                                    />
                                    <label
                                        htmlFor="resultados-upload"
                                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${formData.resultadosLaboratorio
                                            ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                            : 'bg-gray-50 border-gray-300 hover:border-emerald-400 hover:bg-emerald-50'
                                            }`}
                                    >
                                        <Upload className={`w-8 h-8 mb-3 ${formData.resultadosLaboratorio ? 'text-green-500' : 'text-gray-400'}`} />
                                        <p className={`text-sm font-medium ${formData.resultadosLaboratorio ? 'text-green-600' : 'text-gray-500'}`}>
                                            {formData.resultadosLaboratorio
                                                ? `${formData.resultadosLaboratorio.length} arquivo(s) carregado(s)`
                                                : 'Carregar laudos do laboratório'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG - Máximo 10MB</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading && activeIndex === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
                    <p className="text-gray-600">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Toast />

            {/* Cabeçalho */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-500 text-white p-8 border-b">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold">Lançamento de Resultados</h1>
                                <p className="text-emerald-100 mt-1">
                                    {amostraSelecionada
                                        ? `Amostra: AMT-${amostraSelecionada._id || `#${amostraSelecionada.id}`}`
                                        : 'Sistema de Gestão de Análises de Solo'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Indicador de Progresso */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex justify-between items-center overflow-x-auto">
                        {steps.map((stepObj, idx) => (
                            <div
                                key={idx}
                                className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-2 ${idx > activeIndex ? 'opacity-50' : ''
                                    } ${(idx === 0 && !amostraSelecionada) ? 'pointer-events-none' : ''}`}
                                onClick={() => {
                                    if (idx === 0 || (idx > 0 && amostraSelecionada)) {
                                        setActiveIndex(idx);
                                    }
                                }}
                            >
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${idx < activeIndex
                                        ? 'bg-emerald-500 text-white'
                                        : idx === activeIndex
                                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}
                                >
                                    {React.createElement(stepObj.icon, { size: 24 })}
                                </div>
                                <span className={`text-xs text-center font-medium ${idx === activeIndex ? 'text-emerald-700' : 'text-gray-500'}`}>
                                    {stepObj.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
                        <div
                            className="bg-emerald-600 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Conteúdo */}
            <div className="max-w-7xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-sm border min-h-[600px] p-8">
                    {renderStepContent(activeIndex)}
                </div>
            </div>

            {/* Rodapé com Navegação */}
            <div className="bg-white border-t sticky bottom-0">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex justify-between items-center">
                        <button
                            className={`px-6 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0
                                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                : 'bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                            disabled={activeIndex === 0}
                        >
                            <ChevronLeft className="mr-2" size={18} />
                            Anterior
                        </button>

                        <div className="text-sm text-gray-500 font-medium">
                            Etapa {activeIndex + 1} de {steps.length}
                        </div>

                        {activeIndex === steps.length - 1 ? (
                            <button
                                className={`px-6 py-3 rounded-xl flex items-center transition-all font-medium shadow-lg ${saving
                                    ? 'bg-emerald-400 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                onClick={handleSave}
                                disabled={saving || !amostraSelecionada}
                            >
                                {saving ? (
                                    <>
                                        <Loader className="animate-spin mr-2" size={18} />
                                        Salvando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2" size={18} />
                                        Salvar Resultados
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                className={`px-6 py-3 rounded-xl flex items-center transition-all font-medium shadow-lg ${(activeIndex === 0 && !amostraSelecionada)
                                    ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                onClick={() => setActiveIndex(Math.min(steps.length - 1, activeIndex + 1))}
                                disabled={activeIndex === 0 && !amostraSelecionada}
                            >
                                Próximo
                                <ChevronRight className="ml-2" size={18} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LancamentoResultadosSolo;