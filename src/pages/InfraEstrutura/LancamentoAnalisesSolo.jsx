import {
    Activity,
    Beaker,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Save,
    Search,
    Upload
} from 'lucide-react';
import React, { useState } from 'react';

import CustomInput from '../../core/components/CustomInput';

const LancamentoAnalisesSolo = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [amostraEncontrada, setAmostraEncontrada] = useState(false);

    const initialState = {
        // Identificação da Amostra
        codigoAmostra: '',
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
    const [dadosAmostra, setDadosAmostra] = useState(null);

    const steps = [
        { label: 'Identificação', icon: Search },
        { label: 'Análises Físicas', icon: Beaker },
        { label: 'Nutrientes', icon: Activity },
        { label: 'Recomendações', icon: CheckCircle }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const buscarAmostra = () => {
        // Simulação de busca de amostra
        setTimeout(() => {
            setAmostraEncontrada(true);
            setDadosAmostra({
                codigo: formData.codigoAmostra,
                provincia: 'Luanda',
                municipio: 'Luanda',
                dataColeta: '2025-09-15',
                profundidade: '0-15cm',
                tipoSolo: 'Franco-Argiloso'
            });
        }, 1000);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log('Dados das análises:', formData);
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert('Análises laboratoriais registradas com sucesso!');
            setFormData(initialState);
            setAmostraEncontrada(false);
            setDadosAmostra(null);
            setActiveIndex(0);
        } catch (error) {
            console.error('Erro ao salvar:', error);
            alert('Erro ao registrar análises. Tente novamente.');
        } finally {
            setSaving(false);
        }
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Identificação da Amostra
                return (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Search className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação da Amostra</h3>
                            </div>
                            <p className="text-gray-600">Localize a amostra para registrar os resultados das análises.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                            <h4 className="text-lg font-semibold mb-4">Buscar Amostra</h4>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <CustomInput
                                        type="text"
                                        label="Código da Amostra"
                                        value={formData.codigoAmostra}
                                        onChange={(value) => handleInputChange('codigoAmostra', value)}
                                        placeholder="Digite o código da amostra"
                                        required
                                    />
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={buscarAmostra}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center transition-all"
                                        disabled={!formData.codigoAmostra}
                                    >
                                        <Search className="mr-2" size={18} />
                                        Buscar
                                    </button>
                                </div>
                            </div>
                        </div>

                        {amostraEncontrada && dadosAmostra && (
                            <div className="bg-green-50 rounded-2xl border border-green-200 p-6 mb-6">
                                <div className="flex items-center mb-4">
                                    <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                                    <h4 className="text-lg font-semibold text-green-900">Amostra Encontrada</h4>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-700">Código:</span>
                                        <p className="text-gray-600">{dadosAmostra.codigo}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Província:</span>
                                        <p className="text-gray-600">{dadosAmostra.provincia}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Município:</span>
                                        <p className="text-gray-600">{dadosAmostra.municipio}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Data Coleta:</span>
                                        <p className="text-gray-600">{dadosAmostra.dataColeta}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Profundidade:</span>
                                        <p className="text-gray-600">{dadosAmostra.profundidade}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700">Tipo Solo:</span>
                                        <p className="text-gray-600">{dadosAmostra.tipoSolo}</p>
                                    </div>
                                </div>
                            </div>
                        )}

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
                    </div>
                );

            case 1: // Análises Físicas
                return (
                    <div className="max-w-4xl mx-auto">
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
                                            { label: "Alface", value: "alface" },
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

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold mb-4">Anexar Resultados do Laboratório</h4>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                        multiple
                                        onChange={(e) => handleInputChange('resultadosLaboratorio', e.target.files)}
                                        id="resultados-upload"
                                    />
                                    <label
                                        htmlFor="resultados-upload"
                                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${formData.resultadosLaboratorio
                                                ? 'bg-green-50 border-green-300 hover:bg-green-100'
                                                : 'bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                            }`}
                                    >
                                        <Upload className={`w-8 h-8 mb-3 ${formData.resultadosLaboratorio ? 'text-green-500' : 'text-gray-400'}`} />
                                        <p className={`text-sm font-medium ${formData.resultadosLaboratorio ? 'text-green-600' : 'text-gray-500'}`}>
                                            {formData.resultadosLaboratorio
                                                ? `${formData.resultadosLaboratorio.length} arquivo(s) carregado(s)`
                                                : 'Carregar laudos do laboratório'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX, JPG, PNG - Máximo 10MB por arquivo</p>
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

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="text-center mb-6 p-10 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h1 className="text-4xl font-bold mb-3 text-gray-800">Lançamento de Análises Laboratoriais</h1>
                <p className="text-gray-600">Sistema de Gestão de Análises de Solo</p>
            </div>

            <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                {steps.map((stepObj, idx) => (
                    <div
                        key={idx}
                        className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${idx > activeIndex ? 'opacity-50' : ''
                            }`}
                        onClick={() => idx <= activeIndex && setActiveIndex(idx)}
                    >
                        <div
                            className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${idx < activeIndex
                                    ? 'bg-purple-500 text-white'
                                    : idx === activeIndex
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                        >
                            {React.createElement(stepObj.icon, { size: 28, className: "mx-auto" })}
                        </div>
                        <span className={`text-sm text-center font-medium ${idx === activeIndex ? 'text-purple-700' : 'text-gray-500'}`}>
                            {stepObj.label}
                        </span>
                    </div>
                ))}
            </div>

            <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                <div
                    className="bg-purple-600 h-2 transition-all duration-300 rounded-full"
                    style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                ></div>
            </div>

            <div className="step-content p-8 bg-white min-h-[600px]">
                {renderStepContent(activeIndex)}
            </div>

            <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
                <button
                    className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0
                            ? 'opacity-50 cursor-not-allowed bg-gray-100'
                            : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                        }`}
                    onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                >
                    <ChevronLeft className="mr-2" size={16} />
                    Anterior
                </button>

                <div className="text-sm text-gray-500 font-medium">
                    Etapa {activeIndex + 1} de {steps.length}
                </div>

                <button
                    className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${activeIndex === steps.length - 1
                            ? (saving ? 'bg-purple-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg')
                            : 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg'
                        }`}
                    onClick={() => {
                        if (activeIndex === steps.length - 1) {
                            handleSave();
                        } else {
                            setActiveIndex(Math.min(steps.length - 1, activeIndex + 1));
                        }
                    }}
                    disabled={activeIndex === steps.length - 1 && saving}
                >
                    {activeIndex === steps.length - 1 ? (
                        saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2" size={18} />
                                Salvar Análises
                            </>
                        )
                    ) : (
                        'Próximo'
                    )}
                    <ChevronRight className="ml-2" size={16} />
                </button>
            </div>
        </div>
    );
};

export default LancamentoAnalisesSolo;