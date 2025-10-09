import {
  AlertCircle,
  Calculator,
  CheckCircle,
  CreditCard,
  DollarSign,
  FileText,
  Info,
  Loader,
  Package,
  Save,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';
import CustomInput from '../../../../core/components/CustomInput';

// CustomInput component


const CadastroIncentivos = () => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [percentError, setPercentError] = useState('');
  const [apiErrors, setApiErrors] = useState({});

  // Estado inicial do formulário de incentivo
  const initialIncentiveState = {
    nomeIncentivo: '',
    descricao: '',
    tipoIncentivo: '',
    valor: '',
    produto: '',
    quantidade: '',
    unidade: '',
    valorPorUnidade: '',
    formaPagamento: '',
    porcentagemReembolso: '',
    observacoes: '',
    dataDeVencimentoDoReembolso: '',
  };

  const [formData, setFormData] = useState(initialIncentiveState);

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Função para calcular valor total do produto
  const calcularValorTotalProduto = () => {
    const quantidade = parseFloat(formData.quantidade || 0);
    const valorPorUnidade = parseFloat(formData.valorPorUnidade || 0);
    return quantidade * valorPorUnidade;
  };

  // Função para calcular valor do reembolso
  const calcularValorReembolso = () => {
    const porcentagem = parseFloat(formData.porcentagemReembolso || 0);
    let valorTotal = 0;

    if (formData.tipoIncentivo === 'DINHEIRO') {
      valorTotal = parseFloat(formData.valor || 0);
    } else if (formData.tipoIncentivo === 'PRODUTO') {
      valorTotal = calcularValorTotalProduto();
    }

    return (valorTotal * porcentagem) / 100;
  };

  // Função para calcular valor líquido para o produtor
  const calcularValorLiquidoProdutor = () => {
    let valorTotal = 0;

    if (formData.tipoIncentivo === 'DINHEIRO') {
      valorTotal = parseFloat(formData.valor || 0);
    } else if (formData.tipoIncentivo === 'PRODUTO') {
      valorTotal = calcularValorTotalProduto();
    }

    return valorTotal - calcularValorReembolso();
  };

  // Função para mapear os dados do formulário para o formato da API
  const mapearDadosParaAPI = () => {
    const valorReembolso = calcularValorReembolso();
    const valorProduto = formData.tipoIncentivo === 'DINHEIRO' ?
      parseFloat(formData.valor || 0) :
      calcularValorTotalProduto();

    return {
      nomeDoIncentivo: formData.nomeIncentivo,
      tipoDoIncentivo: formData.tipoIncentivo,
      porcentagemDeReembolso: parseFloat(formData.porcentagemReembolso || 0),
      valorDoReembolso: valorReembolso,
      descricaoDoIncentivo: formData.descricao,
      valorPorProduto: valorProduto,
      formaDePagamento: formData.formaPagamento,
      nomeDoProduto: formData.produto || '',
      quantidadePorProduto: parseFloat(formData.quantidade || 0),
      unidade: formData.unidade || '',
      valorPorKg: parseFloat(formData.valorPorUnidade || 0),
      formaDeEntrega: formData.formaPagamento,
      dataDeVencimentoDoReembolso: formData.dataDeVencimentoDoReembolso || new Date().toISOString().split('T')[0],
      observacoes: formData.observacoes || ''
    };
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Validações básicas
      if (!formData.nomeIncentivo || !formData.tipoIncentivo) {
        showToast('error', 'Validação', 'Preencha todos os campos obrigatórios do incentivo');
        setLoading(false);
        return;
      }

      if (formData.tipoIncentivo === 'DINHEIRO' && (!formData.valor || !formData.formaPagamento)) {
        showToast('error', 'Validação', 'Preencha o valor e a forma de pagamento');
        setLoading(false);
        return;
      }

      if (formData.tipoIncentivo === 'PRODUTO' && (!formData.produto || !formData.quantidade || !formData.unidade)) {
        showToast('error', 'Validação', 'Preencha todos os dados obrigatórios do produto');
        setLoading(false);
        return;
      }

      // Mapear dados para o formato da API
      const dadosAPI = mapearDadosParaAPI();

      // Fazer POST para a API
      const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/incentivo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAPI),
      });

      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        let errorJson = null;
        try {
          const errorText = await response.text();
          if (errorText) {
            try {
              errorJson = JSON.parse(errorText);
            } catch {
              errorMessage += ` - ${errorText}`;
            }
          }
        } catch {
          // Ignorar erro de leitura
        }
        // Se vier erro específico do campo dataDeVencimentoDoReembolso
        if (errorJson && errorJson.errors && errorJson.errors.dataDeVencimentoDoReembolso) {
          setApiErrors(prev => ({ ...prev, dataDeVencimentoDoReembolso: errorJson.errors.dataDeVencimentoDoReembolso }));
        }
        throw new Error(errorMessage);
      } else {
        setApiErrors({}); // Limpa erros se sucesso
      }

      // Processar resposta
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        try {
          const responseText = await response.text();
          if (responseText) {
            // responseData = JSON.parse(responseText); // This line is removed
          }
        } catch {
          // Se não conseguir fazer parse, continuar mesmo assim
          // responseData = { message: 'Resposta processada com sucesso' };
        }
      } else {
        // Apenas para manter compatibilidade, mas não é usado
        // responseData = { message: 'Incentivo cadastrado com sucesso' };
      }

      setLoading(false);
      showToast('success', 'Sucesso', 'Incentivo registado com sucesso!');

      // Limpar formulário após sucesso
      setFormData(initialIncentiveState);

    } catch (error) {
      setLoading(false);
      let errorMessage = '';
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão com a API. Verifique a sua ligação à internet.';
      } else if (error.message.includes('SyntaxError')) {
        errorMessage = 'A API devolveu uma resposta inválida.';
      } else if (error.message) {
        // Remove qualquer ocorrência de 'Erro 409' ou 'Erro HTTP 409' do texto
        errorMessage = error.message.replace(/Erro ?HTTP? ?409:? ?-?/gi, '').replace(/Erro ?409:? ?-?/gi, '').trim();
      } else {
        errorMessage = 'Erro ao registar incentivo';
      }

      // Se a mensagem de erro mencionar data, exibe no helperText do input de data
      if (errorMessage.toLowerCase().includes('data')) {
        setApiErrors(prev => ({ ...prev, dataDeVencimentoDoReembolso: errorMessage }));
      }

      showToast('error', 'Erro ao registar incentivo', errorMessage);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
            toastMessage.severity === 'warn' ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' :
              'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
          }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {toastMessage.severity === 'success' && <CheckCircle size={20} />}
              {toastMessage.severity === 'error' && <AlertCircle size={20} />}
              {toastMessage.severity === 'warn' && <AlertCircle size={20} />}
              {toastMessage.severity === 'info' && <Info size={20} />}
            </div>
            <div>
              <p className="font-bold">{toastMessage.summary}</p>
              <p className="text-sm">{toastMessage.detail}</p>
            </div>
          </div>
        </div>
      )}

      <div className="">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
            <div className="flex items-center justify-center space-x-3 mb-3">

              <h1 className="text-4xl font-bold text-gray-800">Cadastro de Incentivos</h1>
            </div>

          </div>

          {/* Formulário */}
          <div className="p-8">
            <div className="space-y-8">
              {/* Informações Básicas do Incentivo */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Informações do Incentivo
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomInput
                    type="text"
                    label="Nome do Incentivo"
                    value={formData.nomeIncentivo}
                    onChange={(value) => handleInputChange('nomeIncentivo', value)}
                    required
                    placeholder="Ex: Apoio à Produção de Milho 2025"
                    iconStart={<FileText size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Tipo de Incentivo"
                    value={formData.tipoIncentivo ? {
                      label: formData.tipoIncentivo === 'DINHEIRO' ? 'Monetário' : 'Produto',
                      value: formData.tipoIncentivo
                    } : null}
                    options={[
                      { label: 'Monetário', value: 'DINHEIRO' },
                      { label: 'Produto', value: 'PRODUTO' }
                    ]}
                    onChange={(value) => handleInputChange('tipoIncentivo', typeof value === 'object' ? value.value : value)}
                    required
                    iconStart={formData.tipoIncentivo === 'DINHEIRO' ? <DollarSign size={18} /> : <Package size={18} />}
                  />

                  <CustomInput
                    type="number"
                    label="Percentagem de Reembolso (%)"
                    value={formData.porcentagemReembolso}
                    onChange={(value) => {
                      if (parseFloat(value) > 100) {
                        setPercentError('O valor máximo permitido é 100%.');
                        handleInputChange('porcentagemReembolso', 100);
                      } else {
                        setPercentError('');
                        handleInputChange('porcentagemReembolso', value);
                      }
                    }}
                    placeholder="Ex: 10"
                    iconStart={<Calculator size={18} />}
                    step="0.1"
                    min="0"
                    max="100"
                    helperText={percentError ? <span className="text-red-600 font-medium">{percentError}</span> : "Percentagem do valor total a ser reembolsado"}
                  />
                </div>

                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Descrição do Incentivo"
                    value={formData.descricao}
                    onChange={(value) => handleInputChange('descricao', value)}
                    placeholder="Descreva o objectivo e detalhes do incentivo..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Detalhes por Tipo - Dinheiro */}
              {formData.tipoIncentivo === 'DINHEIRO' && (
                <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                    Detalhes do Pagamento Monetário
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      type="number"
                      label="Valor por Agricultor (Kwanzas)"
                      value={formData.valor}
                      onChange={(value) => handleInputChange('valor', value)}
                      required
                      placeholder="0,00"
                      iconStart={<DollarSign size={18} />}
                      step="0.01"
                    />

                    <CustomInput
                      type="select"
                      label="Forma de Pagamento"
                      value={formData.formaPagamento ? {
                        label:
                          formData.formaPagamento === 'NUMERARIO' ? 'Pagamento em Numerário' :
                            formData.formaPagamento === 'TRANSFERENCIA' ? 'Transferência Bancária' :
                              'Entrega Directa',
                        value: formData.formaPagamento
                      } : null}
                      options={[
                        { label: 'Pagamento em Numerário', value: 'NUMERARIO' },
                        { label: 'Transferência Bancária', value: 'TRANSFERENCIA' }
                      ]}
                      onChange={(value) => handleInputChange('formaPagamento', typeof value === 'object' ? value.value : value)}
                      required
                      iconStart={<CreditCard size={18} />}
                    />
                  </div>

                  {formData.valor && (
                    <div className="mt-6 p-6 bg-blue-100 rounded-lg border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-4 text-center flex items-center justify-center">
                        <Calculator className="w-5 h-5 mr-2" />
                        💰 Cálculo do Incentivo em Dinheiro
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                          <span className="block text-2xl font-bold text-blue-600">
                            {parseFloat(formData.valor || 0).toLocaleString('pt-AO', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })} Kz
                          </span>
                          <span className="text-blue-700 text-sm font-medium">💎 Valor Total</span>
                        </div>

                        {formData.porcentagemReembolso && (
                          <>
                            <div className="text-center p-4 bg-white rounded-lg border-2 border-red-200">
                              <span className="block text-2xl font-bold text-red-600">
                                {calcularValorReembolso().toLocaleString('pt-AO', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })} Kz
                              </span>
                              <span className="text-red-700 text-sm font-medium flex items-center justify-center">
                                <TrendingDown size={16} className="mr-1" />
                                🔄 Reembolso ({formData.porcentagemReembolso}%)
                              </span>
                            </div>

                            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                              <span className="block text-2xl font-bold text-green-600">
                                {calcularValorLiquidoProdutor().toLocaleString('pt-AO', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })} Kz
                              </span>
                              <span className="text-green-700 text-sm font-bold flex items-center justify-center">
                                <TrendingUp size={16} className="mr-1" />
                                ✅ Valor Líquido para Agricultor
                              </span>
                            </div>

                            <div className="text-center p-4 bg-gray-100 rounded-lg border-2 border-gray-300">
                              <span className="block text-lg font-bold text-gray-700">
                                {(100 - parseFloat(formData.porcentagemReembolso || 0)).toFixed(1)}%
                              </span>
                              <span className="text-gray-600 text-sm font-medium">🎯 Percentual Efectivo</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Detalhes por Tipo - Produto */}
              {formData.tipoIncentivo === 'PRODUTO' && (
                <div className="bg-orange-50 rounded-2xl border border-orange-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-orange-600" />
                    Detalhes do Produto
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <CustomInput
                      type="text"
                      label="Nome do Produto"
                      value={formData.produto}
                      onChange={(value) => handleInputChange('produto', value)}
                      required
                      placeholder="Ex: Sementes de Milho, Fertilizante"
                      iconStart={<Package size={18} />}
                    />

                    <CustomInput
                      type="number"
                      label="Quantidade por Agricultor"
                      value={formData.quantidade}
                      onChange={(value) => handleInputChange('quantidade', value)}
                      required
                      placeholder="0"
                      iconStart={<Package size={18} />}
                      step="0.1"
                    />

                    <CustomInput
                      type="select"
                      label="Unidade"
                      value={formData.unidade ? { label: formData.unidade, value: formData.unidade } : null}
                      options={[
                        { label: 'Kg', value: 'KG' },
                        { label: 'Litros', value: 'LITROS' },
                        { label: 'Unidades', value: 'UNIDADES' },
                        { label: 'Sacos', value: 'SACOS' },
                        { label: 'Caixas', value: 'CAIXAS' }
                      ]}
                      onChange={(value) => handleInputChange('unidade', typeof value === 'object' ? value.value : value)}
                      required
                      iconStart={<Package size={18} />}
                    />

                    <CustomInput
                      type="number"
                      label={`Valor por ${formData.unidade ? formData.unidade.replace('KG', 'Kg').replace('LITROS', 'Litro').replace('UNIDADES', 'Unidade').replace('SACOS', 'Saco').replace('CAIXAS', 'Caixa') : 'Unidade'} (Kwanzas)`}
                      value={formData.valorPorUnidade}
                      onChange={(value) => handleInputChange('valorPorUnidade', value)}
                      placeholder="0,00"
                      iconStart={<DollarSign size={18} />}
                      step="0.01"
                      helperText="Valor unitário do produto"
                    />
                  </div>

                  <div className="mt-6">
                    <CustomInput
                      type="select"
                      label="Forma de Entrega"
                      value={formData.formaPagamento ? {
                        label: formData.formaPagamento === 'ENTREGA_FISICA' ? 'Entrega Directa na Propriedade' : 'Levantamento no Local Designado',
                        value: formData.formaPagamento
                      } : null}
                      options={[
                        { label: 'Entrega Directa na Propriedade', value: 'ENTREGA_FISICA' },
                        { label: 'Levantamento no Local Designado', value: 'RETIRADA_LOCAL' }
                      ]}
                      onChange={(value) => handleInputChange('formaPagamento', typeof value === 'object' ? value.value : value)}
                      required
                      iconStart={<Package size={18} />}
                    />
                  </div>

                  {formData.quantidade && formData.unidade && (
                    <div className="mt-6 p-6 bg-orange-100 rounded-lg border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-4 text-center flex items-center justify-center">
                        <Calculator className="w-5 h-5 mr-2" />
                        📦 Cálculo do Incentivo em Produto
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-white rounded-lg">
                          <span className="block text-2xl font-bold text-orange-600">
                            {parseFloat(formData.quantidade || 0)} {formData.unidade}
                          </span>
                          <span className="text-orange-700 text-sm font-medium">📏 Quantidade por Agricultor</span>
                        </div>

                        {formData.valorPorUnidade && (
                          <div className="text-center p-3 bg-white rounded-lg">
                            <span className="block text-2xl font-bold text-blue-600">
                              {parseFloat(formData.valorPorUnidade || 0).toLocaleString('pt-AO', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} Kz
                            </span>
                            <span className="text-blue-700 text-sm font-medium">
                              💰 Por {formData.unidade ? formData.unidade.replace('KG', 'Kg').replace('LITROS', 'Litro').replace('UNIDADES', 'Unidade').replace('SACOS', 'Saco').replace('CAIXAS', 'Caixa') : 'Unidade'}
                            </span>
                          </div>
                        )}
                      </div>

                      {formData.valorPorUnidade && formData.quantidade && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-white rounded-lg border-2 border-blue-200">
                            <span className="block text-2xl font-bold text-blue-600">
                              {calcularValorTotalProduto().toLocaleString('pt-AO', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} Kz
                            </span>
                            <span className="text-blue-700 text-sm font-bold">💎 Valor Total</span>
                          </div>

                          {formData.porcentagemReembolso && (
                            <>
                              <div className="text-center p-3 bg-white rounded-lg border-2 border-red-200">
                                <span className="block text-2xl font-bold text-red-600">
                                  {calcularValorReembolso().toLocaleString('pt-AO', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })} Kz
                                </span>
                                <span className="text-red-700 text-sm font-medium flex items-center justify-center">
                                  <TrendingDown size={16} className="mr-1" />
                                  🔄 Reembolso ({formData.porcentagemReembolso}%)
                                </span>
                              </div>

                              <div className="text-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                                <span className="block text-2xl font-bold text-green-600">
                                  {calcularValorLiquidoProdutor().toLocaleString('pt-AO', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })} Kz
                                </span>
                                <span className="text-green-700 text-sm font-bold flex items-center justify-center">
                                  <TrendingUp size={16} className="mr-1" />
                                  ✅ Valor Líquido para Agricultor
                                </span>
                              </div>

                              <div className="text-center p-3 bg-gray-100 rounded-lg border-2 border-gray-300">
                                <span className="block text-lg font-bold text-gray-700">
                                  {(100 - parseFloat(formData.porcentagemReembolso || 0)).toFixed(1)}%
                                </span>
                                <span className="text-gray-600 text-sm font-medium">🎯 Percentual Efectivo</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {formData.produto && (
                        <div className="mt-4 p-3 bg-white rounded-lg text-center">
                          <div className="flex items-center justify-center space-x-2 text-orange-800">
                            <Package size={16} />
                            <span className="font-medium">{formData.produto}</span>
                          </div>
                          {formData.formaPagamento && (
                            <div className="mt-1 text-orange-600 text-sm">
                              {formData.formaPagamento === 'ENTREGA_FISICA' ? '🚚 Entrega Directa na Propriedade' : '📍 Levantamento no Local Designado'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Informações Adicionais */}
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Informações Adicionais</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <CustomInput
                    type="date"
                    label="Data de Vencimento do Reembolso"
                    value={formData.dataDeVencimentoDoReembolso}
                    onChange={(value) => handleInputChange('dataDeVencimentoDoReembolso', value)}
                    helperText={apiErrors.dataDeVencimentoDoReembolso ? (
                      <span className="text-red-600 font-medium">{apiErrors.dataDeVencimentoDoReembolso}</span>
                    ) : "Data limite para utilização do incentivo (se aplicável)"}
                  />
                </div>

                <CustomInput
                  type="textarea"
                  label="Observações"
                  value={formData.observacoes}
                  onChange={(value) => handleInputChange('observacoes', value)}
                  placeholder="Informações adicionais sobre o incentivo..."
                  rows={3}
                />
              </div>
            </div>

            {/* Botão de Submissão */}
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                disabled={loading}
                onClick={handleSubmit}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={20} className="animate-spin mr-3" />
                    A Enviar...
                  </>
                ) : (
                  <>
                    <Save size={20} className="mr-3" />
                    Registar Incentivo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default CadastroIncentivos;