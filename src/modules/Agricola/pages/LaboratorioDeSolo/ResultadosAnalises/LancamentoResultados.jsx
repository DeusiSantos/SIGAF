import {
  Activity,
  AlertCircle,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader,
  Search,
  TestTube,
  Upload,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomInput from '../../../../../core/components/CustomInput';

const LancamentoResultados = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [amostrasDisponiveis, setAmostrasDisponiveis] = useState([]);
  const [parametrosEnsaio, setParametrosEnsaio] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const API_BASE_URL = 'http://mwangobrainsa-001-site2.mtempurl.com/api';

  const steps = [
    { label: 'Identificação', icon: Search },
    { label: 'Resultados', icon: Activity },
    { label: 'Finalização', icon: FileText }
  ];

  const [formData, setFormData] = useState({
    amostraId: '',
    dataAnalise: new Date().toISOString().split('T')[0],
    tecnicoResponsavel: '',
    supervisor: '',
    dataAprovacao: '',
    observacoesGerais: '',
    anexoResultados: null,
    resultados: []
  });

  useEffect(() => {
    carregarAmostras();
  }, []);

  const carregarAmostras = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/testeDeAmostraDeSolo/all`);
      if (!response.ok) throw new Error('Erro ao carregar amostras');
      const data = await response.json();
      setAmostrasDisponiveis(data);
    } catch (error) {
      console.error('Erro ao carregar amostras:', error);
      showToast('error', 'Erro', 'Não foi possível carregar as amostras');
    } finally {
      setLoading(false);
    }
  };

  const carregarParametrosEnsaio = async (amostraId) => {
    setLoading(true);
    try {
      // Simular carregamento de parâmetros - substituir pela API real
      const parametrosMock = [
        {
          id: 1,
          parametro: 'pH',
          unidade: '—',
          metodo: 'Potenciométrico',
          limiteInferior: 6.0,
          limiteSuperior: 7.5,
          valorObtido: '',
          situacao: '',
          observacoes: ''
        },
        {
          id: 2,
          parametro: 'Fósforo (P)',
          unidade: 'mg/dm³',
          metodo: 'Fotocolorimetria',
          limiteInferior: 15.0,
          limiteSuperior: 40.0,
          valorObtido: '',
          situacao: '',
          observacoes: ''
        },
        {
          id: 3,
          parametro: 'Potássio (K)',
          unidade: 'cmolc/dm³',
          metodo: 'Fotometria de Chama',
          limiteInferior: 0.15,
          limiteSuperior: 0.40,
          valorObtido: '',
          situacao: '',
          observacoes: ''
        },
        {
          id: 4,
          parametro: 'Matéria Orgânica',
          unidade: '%',
          metodo: 'Walkley-Black',
          limiteInferior: 2.0,
          limiteSuperior: 5.0,
          valorObtido: '',
          situacao: '',
          observacoes: ''
        }
      ];

      setParametrosEnsaio(parametrosMock);
      setFormData(prev => ({
        ...prev,
        resultados: parametrosMock.map(p => ({
          parametroId: p.id,
          valorObtido: '',
          observacoes: ''
        }))
      }));
    } catch (error) {
      console.error('Erro ao carregar parâmetros:', error);
      showToast('error', 'Erro', 'Não foi possível carregar os parâmetros de ensaio');
    } finally {
      setLoading(false);
    }
  };

  const calcularSituacao = (valor, limiteInferior, limiteSuperior) => {
    if (!valor || valor === '') return '';

    const valorNum = parseFloat(valor);
    if (isNaN(valorNum)) return '';

    if (valorNum < limiteInferior) return 'abaixo';
    if (valorNum > limiteSuperior) return 'acima';
    return 'dentro';
  };

  const getSituacaoIcon = (situacao) => {
    switch (situacao) {
      case 'dentro':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'abaixo':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'acima':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getSituacaoTexto = (situacao) => {
    switch (situacao) {
      case 'dentro':
        return 'Dentro do padrão';
      case 'abaixo':
        return 'Abaixo do padrão';
      case 'acima':
        return 'Acima do padrão';
      default:
        return '';
    }
  };

  const handleAmostraChange = (amostra) => {
    setFormData(prev => ({ ...prev, amostraId: amostra.value }));
    carregarParametrosEnsaio(amostra.value);
  };

  const handleValorChange = (parametroId, valor) => {
    const parametro = parametrosEnsaio.find(p => p.id === parametroId);
    if (parametro) {
      const situacao = calcularSituacao(valor, parametro.limiteInferior, parametro.limiteSuperior);

      setParametrosEnsaio(prev => prev.map(p =>
        p.id === parametroId
          ? { ...p, valorObtido: valor, situacao }
          : p
      ));

      setFormData(prev => ({
        ...prev,
        resultados: prev.resultados.map(r =>
          r.parametroId === parametroId
            ? { ...r, valorObtido: valor }
            : r
        )
      }));
    }
  };

  const handleObservacaoChange = (parametroId, observacao) => {
    setParametrosEnsaio(prev => prev.map(p =>
      p.id === parametroId
        ? { ...p, observacoes: observacao }
        : p
    ));

    setFormData(prev => ({
      ...prev,
      resultados: prev.resultados.map(r =>
        r.parametroId === parametroId
          ? { ...r, observacoes: observacao }
          : r
      )
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const dadosParaEnvio = {
        ...formData,
        resultados: parametrosEnsaio.map(p => ({
          parametroId: p.id,
          valorObtido: p.valorObtido,
          situacao: p.situacao,
          observacoes: p.observacoes
        }))
      };

      // Simular salvamento - substituir pela API real
      await new Promise(resolve => setTimeout(resolve, 2000));

      showToast('success', 'Sucesso', 'Resultados salvos com sucesso!');

      // Reset do formulário
      setFormData({
        amostraId: '',
        dataAnalise: new Date().toISOString().split('T')[0],
        tecnicoResponsavel: '',
        supervisor: '',
        dataAprovacao: '',
        observacoesGerais: '',
        anexoResultados: null,
        resultados: []
      });
      setParametrosEnsaio([]);

    } catch (error) {
      console.error('Erro ao salvar:', error);
      showToast('error', 'Erro', 'Erro ao salvar resultados');
    } finally {
      setSaving(false);
    }
  };

  const showToast = (type, title, message) => {
    setToastMessage({ type, title, message });
    setTimeout(() => setToastMessage(null), 5000);
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
      case 0: // Identificação
        return (
          <div className="space-y-6 min-h-[600px]">
            <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-6 mb-8 border border-blue-200">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Identificação Geral</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomInput
                type="select"
                label="Código da Amostra"
                value={formData.amostraId ? {
                  value: formData.amostraId,
                  label: amostrasDisponiveis.find(a => a.id === formData.amostraId)?.numeroAmostra || formData.amostraId
                } : ''}
                options={amostrasDisponiveis.map(amostra => ({
                  label: `${amostra.numeroAmostra || amostra.id} - ${amostra.localizacao?.municipio || amostra.municipio || 'N/A'}`,
                  value: amostra.id
                }))}
                onChange={handleAmostraChange}
                required
                placeholder="Selecione uma amostra"
                iconStart={<TestTube size={18} />}
              />

              <CustomInput
                type="date"
                label="Data da Análise"
                value={formData.dataAnalise}
                onChange={(value) => setFormData(prev => ({ ...prev, dataAnalise: value }))}
                required
                iconStart={<Calendar size={18} />}
              />

              <CustomInput
                type="text"
                label="Técnico Responsável"
                value={formData.tecnicoResponsavel}
                onChange={(value) => setFormData(prev => ({ ...prev, tecnicoResponsavel: value }))}
                required
                placeholder="Nome do analista"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="text"
                label="Supervisor"
                value={formData.supervisor}
                onChange={(value) => setFormData(prev => ({ ...prev, supervisor: value }))}
                placeholder="Responsável técnico"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="date"
                label="Data de Aprovação"
                value={formData.dataAprovacao}
                onChange={(value) => setFormData(prev => ({ ...prev, dataAprovacao: value }))}
                iconStart={<Calendar size={18} />}
                helperText="Preenchida após revisão"
              />
            </div>
          </div>
        );

      case 1: // Resultados
        return (
          <div className="space-y-6 min-h-[600px]">
            <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 mb-8 border border-green-200">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lançamento de Resultados</h3>
              </div>
            </div>

            {parametrosEnsaio.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700 min-w-[150px]">Parâmetro</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700 min-w-[120px]">Valor Obtido</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700 min-w-[80px]">Unidade</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700 min-w-[140px]">Método Utilizado</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700 min-w-[140px]">Situação</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700 min-w-[200px]">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parametrosEnsaio.map((parametro) => (
                      <tr key={parametro.id} className="hover:bg-gray-50">
                        <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">
                          {parametro.parametro}
                          <div className="text-xs text-gray-500 mt-1">
                            Limites: {parametro.limiteInferior} - {parametro.limiteSuperior}
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <input
                            type="number"
                            step="0.01"
                            value={parametro.valorObtido}
                            onChange={(e) => handleValorChange(parametro.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0.00"
                          />
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-600 text-center">
                          {parametro.unidade}
                        </td>
                        <td className="border border-gray-200 px-4 py-3 text-gray-600 text-sm">
                          {parametro.metodo}
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <div className="flex items-center space-x-2">
                            {getSituacaoIcon(parametro.situacao)}
                            <span className={`text-sm font-medium ${parametro.situacao === 'dentro' ? 'text-green-600' :
                                parametro.situacao === 'abaixo' ? 'text-yellow-600' :
                                  parametro.situacao === 'acima' ? 'text-red-600' : 'text-gray-400'
                              }`}>
                              {getSituacaoTexto(parametro.situacao)}
                            </span>
                          </div>
                        </td>
                        <td className="border border-gray-200 px-4 py-3">
                          <input
                            type="text"
                            value={parametro.observacoes}
                            onChange={(e) => handleObservacaoChange(parametro.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Observações..."
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <TestTube className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Selecione uma amostra na etapa anterior para carregar os parâmetros de ensaio</p>
              </div>
            )}
          </div>
        );

      case 2: // Finalização
        return (
          <div className="space-y-6 min-h-[600px]">
            <div className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-2xl p-6 mb-8 border border-orange-200">
              <div className="flex gap-3 items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <FileText className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Observações e Finalização</h3>
              </div>
            </div>

            <div className="space-y-6">
              <CustomInput
                type="textarea"
                label="Observações Gerais"
                value={formData.observacoesGerais}
                onChange={(value) => setFormData(prev => ({ ...prev, observacoesGerais: value }))}
                placeholder="Comentários técnicos ou notas adicionais sobre a análise..."
                rows={4}
              />

              {/* Anexar Resultados do Laboratório */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexar Resultados do Laboratório
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="anexo-resultados"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Clique para anexar arquivo</span>
                        <input
                          id="anexo-resultados"
                          name="anexo-resultados"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormData(prev => ({ ...prev, anexoResultados: file }));
                          }}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG até 10MB
                    </p>
                  </div>
                </div>
                {formData.anexoResultados && (
                  <div className="mt-3 flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-700">{formData.anexoResultados.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, anexoResultados: null }))}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Resumo dos Resultados */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4">Resumo dos Resultados</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-100 rounded-lg">
                    <div className="text-2xl font-bold text-green-800">
                      {parametrosEnsaio.filter(p => p.situacao === 'dentro').length}
                    </div>
                    <div className="text-green-600 font-medium">Dentro do Padrão</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-800">
                      {parametrosEnsaio.filter(p => p.situacao === 'abaixo').length}
                    </div>
                    <div className="text-yellow-600 font-medium">Abaixo do Padrão</div>
                  </div>
                  <div className="text-center p-4 bg-red-100 rounded-lg">
                    <div className="text-2xl font-bold text-red-800">
                      {parametrosEnsaio.filter(p => p.situacao === 'acima').length}
                    </div>
                    <div className="text-red-600 font-medium">Acima do Padrão</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const nextStep = () => {
    if (activeIndex < steps.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevStep = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toast />

      <div className="mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Lançamento de Resultados</h1>
            <p className="text-gray-600">Registre os resultados laboratoriais obtidos de cada amostra com comparação automática aos padrões estabelecidos</p>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeIndex;
              const isCompleted = index < activeIndex;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${!isActive && !isCompleted ? 'opacity-50' : ''
                    }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${isActive
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? (
                      <Check size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-500'
                    }`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
            <div
              className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {renderStepContent(activeIndex)}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={activeIndex === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${activeIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      amostraId: '',
                      dataAnalise: new Date().toISOString().split('T')[0],
                      tecnicoResponsavel: '',
                      supervisor: '',
                      dataAprovacao: '',
                      observacoesGerais: '',
                      anexoResultados: null,
                      resultados: []
                    });
                    setParametrosEnsaio([]);
                    setActiveIndex(0);
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Limpar
                </button>

                {activeIndex === steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !formData.amostraId || !formData.tecnicoResponsavel}
                    className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${saving || !formData.amostraId || !formData.tecnicoResponsavel
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    {saving ? (
                      <>
                        <Loader size={20} className="animate-spin mr-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check size={20} className="mr-2" />
                        Salvar Resultados
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={activeIndex === 0 && !formData.amostraId}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${activeIndex === 0 && !formData.amostraId
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                  >
                    Próximo
                    <ChevronRight size={20} className="ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <Loader className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-700">Carregando...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LancamentoResultados;