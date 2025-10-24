import {
  AlertCircle,
  Award,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader,
  MapPin,
  Plus,
  Search,
  Tractor,
  Package,
  Users
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Country, City } from 'country-state-city';

import CustomInput from '../../../../core/components/CustomInput';

export default function BatchForm() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [producers, setProducers] = useState([]);
  const [selectedProducers, setSelectedProducers] = useState([]);
  const [producerProducts, setProducerProducts] = useState({});
  const [countries, setCountries] = useState([]);
  const [originCities, setOriginCities] = useState([]);
  const [destCities, setDestCities] = useState([]);
  const [showAddProducer, setShowAddProducer] = useState(false);
  const [modoBusca, setModoBusca] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    originCountry: null,
    originCity: null,
    destCountry: null,
    destCity: null,
    modoTransporte: 'Carro',
    produtorSelecionado: null,
    newProducer: { name: '', bi: '', type: '' }
  });

  const steps = [
    { label: 'Produtores', icon: Users },
    { label: 'Localização', icon: MapPin },
    { label: 'Transporte', icon: Tractor },
    { label: 'Finalização', icon: Award }
  ];

  useEffect(() => {
    const savedProducers = JSON.parse(localStorage.getItem('producersDB') || '[]')
    setProducers(savedProducers)
    
    const countryOptions = Country.getAllCountries()
      .map(c => ({ value: c.isoCode, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
    setCountries(countryOptions)
  }, [])

  useEffect(() => {
    if (formData.originCountry?.value) {
      const cityOptions = City.getCitiesOfCountry(formData.originCountry.value)
        .map(c => ({ value: c.name, label: c.name }))
        .sort((a, b) => a.label.localeCompare(b.label))
      setOriginCities(cityOptions)
    } else {
      setOriginCities([])
    }
  }, [formData.originCountry])

  useEffect(() => {
    if (formData.destCountry?.value) {
      const cityOptions = City.getCitiesOfCountry(formData.destCountry.value)
        .map(c => ({ value: c.name, label: c.name }))
        .sort((a, b) => a.label.localeCompare(b.label))
      setDestCities(cityOptions)
    } else {
      setDestCities([])
    }
  }, [formData.destCountry])

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const buscarProdutor = (produtorOption) => {
    const produtorId = typeof produtorOption === 'object' ? produtorOption.value : produtorOption;
    const produtor = producers.find(p => p.id === produtorId);

    if (produtor) {
      handleInputChange('produtorSelecionado', produtor);
      if (!selectedProducers.find(p => p.id === produtor.id)) {
        setSelectedProducers([...selectedProducers, produtor]);
        setProducerProducts({ ...producerProducts, [produtor.id]: {} });
      }
      showToast('success', 'Produtor Encontrado', 'Produtor selecionado com sucesso!');
    }
  };

  const addProducer = () => {
    const { name, bi, type } = formData.newProducer;
    if (!name || !bi || !type) {
      showToast('error', 'Erro', 'Preencha todos os campos do produtor');
      return;
    }
    
    const producer = {
      id: Date.now().toString(),
      name,
      bi,
      type,
      quantity: 0
    };

    const updatedProducers = [...producers, producer];
    setProducers(updatedProducers);
    localStorage.setItem('producersDB', JSON.stringify(updatedProducers));
    handleInputChange('newProducer', { name: '', bi: '', type: '' });
    setShowAddProducer(false);
    showToast('success', 'Sucesso', 'Produtor adicionado com sucesso!');
  };

  const toggleProducer = (producer) => {
    const isSelected = selectedProducers.find(p => p.id === producer.id)
    if (isSelected) {
      setSelectedProducers(selectedProducers.filter(p => p.id !== producer.id))
      const newProducts = { ...producerProducts }
      delete newProducts[producer.id]
      setProducerProducts(newProducts)
    } else {
      setSelectedProducers([...selectedProducers, producer])
      setProducerProducts({ ...producerProducts, [producer.id]: {} })
    }
  };

  const updateProducerProduct = (producerId, productType, quantity) => {
    const newProducts = { ...producerProducts }
    if (!newProducts[producerId]) newProducts[producerId] = {}

    if (quantity === '') {
      delete newProducts[producerId][productType]
    } else {
      newProducts[producerId][productType] = parseFloat(quantity) || 0
    }

    setProducerProducts(newProducts)
  };

  const generateBatchCode = () => {
    const year = new Date().getFullYear()
    const timestamp = Date.now().toString().slice(-6)
    return `LOTE-${year}-${timestamp}`
  }

  const generateSubCodes = (batchCode, producers) => {
    return producers.map((producer, index) => ({
      ...producer,
      subCode: `${batchCode.split('-')[2]}-${String.fromCharCode(65 + index)}`
    }))
  }

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (activeIndex) {
      case 0: // Produtores
        if (selectedProducers.length === 0) {
          newErrors.produtorSelecionado = 'Selecione pelo menos um produtor';
        }
        break;
      case 1: // Localização
        if (!formData.originCountry) {
          newErrors.originCountry = 'Campo obrigatório';
        }
        if (!formData.destCountry) {
          newErrors.destCountry = 'Campo obrigatório';
        }
        break;
      case 2: // Transporte
        if (!formData.modoTransporte) {
          newErrors.modoTransporte = 'Campo obrigatório';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (selectedProducers.length === 0) {
        showToast('error', 'Erro', 'Selecione pelo menos um produtor');
        return;
      }

      const batchCode = generateBatchCode();
      const calculatedTotal = Object.values(producerProducts).reduce((sum, products) => {
        return sum + Object.values(products).reduce((pSum, qty) => pSum + qty, 0)
      }, 0);

      const producersWithProducts = selectedProducers.map(producer => ({
        ...producer,
        batchProducts: producerProducts[producer.id] || {},
        batchQuantity: Object.values(producerProducts[producer.id] || {}).reduce((sum, qty) => sum + qty, 0)
      }));

      const producersWithSubCodes = generateSubCodes(batchCode, producersWithProducts);

      const batch = {
        id: Date.now().toString(),
        batchCode,
        totalQuantity: calculatedTotal,
        origin: formData.originCity ? `${formData.originCity.label}, ${formData.originCountry.label}` : formData.originCountry?.label || '',
        destination: formData.destCity ? `${formData.destCity.label}, ${formData.destCountry.label}` : formData.destCountry?.label || '',
        modoTransporte: formData.modoTransporte,
        producers: producersWithSubCodes,
        createdAt: new Date().toISOString(),
        status: 'Criado',
        checkpoints: [],
        sealed: false
      };

      const batchesDB = JSON.parse(localStorage.getItem('batchesDB') || '[]');
      batchesDB.push(batch);
      localStorage.setItem('batchesDB', JSON.stringify(batchesDB));

      showToast('success', 'Sucesso', 'Lote criado com sucesso!');
      navigate('/GerenciaSIGAF/gestao-agricultores/Exportacao');
    } catch (error) {
      showToast('error', 'Erro', 'Erro ao criar lote.');
      console.error('Erro ao criar lote:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0: // Produtores
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Seleção de Produtores</h2>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setModoBusca(!modoBusca)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {modoBusca ? 'Novo Cadastro' : 'Buscar Existente'}
                </button>
              </div>
            </div>

            {modoBusca ? (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Buscar Produtor</h3>
                <CustomInput
                  type="select"
                  label="Selecionar Produtor"
                  value={formData.produtorSelecionado ? { label: `${formData.produtorSelecionado.name} - ${formData.produtorSelecionado.bi}`, value: formData.produtorSelecionado.id } : null}
                  options={producers.map(p => ({ label: `${p.name} - ${p.bi}`, value: p.id }))}
                  onChange={buscarProdutor}
                  placeholder="Selecione um produtor"
                  error={errors.produtorSelecionado}
                />
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-medium mb-4">Novo Produtor</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomInput
                    type="text"
                    label="Nome Completo"
                    value={formData.newProducer.name}
                    onChange={(value) => handleInputChange('newProducer', { ...formData.newProducer, name: value })}
                    placeholder="Nome do produtor"
                  />
                  <CustomInput
                    type="text"
                    label="Bilhete de Identidade"
                    value={formData.newProducer.bi}
                    onChange={(value) => handleInputChange('newProducer', { ...formData.newProducer, bi: value })}
                    placeholder="Número do BI"
                  />
                  <CustomInput
                    type="select"
                    label="Tipo de Produtor"
                    value={formData.newProducer.type ? { label: formData.newProducer.type, value: formData.newProducer.type } : null}
                    options={[
                      { label: 'Florestal', value: 'Florestal' },
                      { label: 'Agrícola', value: 'Agrícola' }
                    ]}
                    onChange={(selected) => handleInputChange('newProducer', { ...formData.newProducer, type: selected?.value || '' })}
                    placeholder="Selecione o tipo"
                  />
                </div>
                <button
                  type="button"
                  onClick={addProducer}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus size={16} className="inline mr-2" />
                  Adicionar Produtor
                </button>
              </div>
            )}

            {/* Lista de Produtores Selecionados */}
            {selectedProducers.length > 0 && (
              <div className="bg-white border rounded-xl p-6">
                <h3 className="text-lg font-medium mb-4">Produtores Selecionados ({selectedProducers.length})</h3>
                <div className="space-y-4">
                  {selectedProducers.map(producer => {
                    const producerBatchProducts = producerProducts[producer.id] || {}
                    return (
                      <div key={producer.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{producer.name}</h4>
                            <p className="text-sm text-gray-500">BI: {producer.bi} • {producer.type}</p>
                          </div>
                          <button
                            onClick={() => toggleProducer(producer)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remover
                          </button>
                        </div>
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Produtos:</label>
                          {['Café', 'Cacau', 'Madeira'].map(productType => (
                            <div key={productType} className="flex items-center gap-3">
                              <label className="flex items-center min-w-[80px]">
                                <input
                                  type="checkbox"
                                  checked={producerBatchProducts[productType] !== undefined}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      updateProducerProduct(producer.id, productType, '0')
                                    } else {
                                      updateProducerProduct(producer.id, productType, '')
                                    }
                                  }}
                                  className="mr-2"
                                />
                                {productType}
                              </label>
                              {producerBatchProducts[productType] !== undefined && (
                                <div className="w-32">
                                  <CustomInput
                                    type="number"
                                    placeholder="Qtd (t)"
                                    value={producerBatchProducts[productType] ?? ''}
                                    onChange={(value) => updateProducerProduct(producer.id, productType, value)}
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Localização
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Localização do Lote</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="select"
                label="Origem - País"
                value={formData.originCountry}
                options={countries}
                onChange={(selected) => {
                  handleInputChange('originCountry', selected)
                  handleInputChange('originCity', null)
                }}
                placeholder="Selecione o país"
                error={errors.originCountry}
              />
              {formData.originCountry && (
                <CustomInput
                  type="select"
                  label="Origem - Cidade"
                  value={formData.originCity}
                  options={originCities}
                  onChange={(selected) => handleInputChange('originCity', selected)}
                  placeholder="Selecione a cidade"
                />
              )}
              <CustomInput
                type="select"
                label="Destino - País"
                value={formData.destCountry}
                options={countries}
                onChange={(selected) => {
                  handleInputChange('destCountry', selected)
                  handleInputChange('destCity', null)
                }}
                placeholder="Selecione o país"
                error={errors.destCountry}
              />
              {formData.destCountry && (
                <CustomInput
                  type="select"
                  label="Destino - Cidade"
                  value={formData.destCity}
                  options={destCities}
                  onChange={(selected) => handleInputChange('destCity', selected)}
                  placeholder="Selecione a cidade"
                />
              )}
            </div>
          </div>
        );

      case 2: // Transporte
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Modo de Transporte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="select"
                label="Modo de Transporte"
                value={formData.modoTransporte ? { label: `${formData.modoTransporte === 'Carro' ? '🚗' : formData.modoTransporte === 'Avião' ? '✈️' : '🚢'} ${formData.modoTransporte}`, value: formData.modoTransporte } : null}
                options={[
                  { label: '🚗 Carro', value: 'Carro' },
                  { label: '✈️ Avião', value: 'Avião' },
                  { label: '🚢 Navio', value: 'Navio' }
                ]}
                onChange={(selected) => handleInputChange('modoTransporte', selected?.value)}
                error={errors.modoTransporte}
              />
              <CustomInput
                type="number"
                label="Quantidade Total (toneladas)"
                value={Object.values(producerProducts).reduce((sum, products) => {
                  return sum + Object.values(products).reduce((pSum, qty) => pSum + qty, 0)
                }, 0).toFixed(1)}
                onChange={() => {}}
                disabled
                placeholder="Calculado automaticamente"
              />
            </div>
          </div>
        );

      case 3: // Finalização
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Resumo do Lote</h2>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700">Produtores:</h3>
                  <p className="text-gray-900">{selectedProducers.length} selecionados</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Quantidade Total:</h3>
                  <p className="text-gray-900">{Object.values(producerProducts).reduce((sum, products) => {
                    return sum + Object.values(products).reduce((pSum, qty) => pSum + qty, 0)
                  }, 0).toFixed(1)} toneladas</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Origem:</h3>
                  <p className="text-gray-900">{formData.originCity ? `${formData.originCity.label}, ${formData.originCountry.label}` : formData.originCountry?.label || 'Não definido'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Destino:</h3>
                  <p className="text-gray-900">{formData.destCity ? `${formData.destCity.label}, ${formData.destCountry.label}` : formData.destCountry?.label || 'Não definido'}</p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-700">Transporte:</h3>
                  <p className="text-gray-900">{formData.modoTransporte}</p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${
          toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
          'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
        }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {toastMessage.severity === 'success' && <CheckCircle size={20} />}
              {toastMessage.severity === 'error' && <AlertCircle size={20} />}
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
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-orange-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800 flex items-center justify-center">
             
              Criar Lote de Exportação
            </h1>
            <p className="text-gray-600">Agregue produtores para formar um lote único de exportação</p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                    index > activeIndex ? 'opacity-50' : ''
                  }`}
                  onClick={() => index <= activeIndex && setActiveIndex(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                    index < activeIndex ? 'bg-gradient-to-r from-blue-50 to-orange-50 text-slate' :
                    index === activeIndex ? 'bg-gradient-to-r from-blue-200 to-orange-100 text-slate-600 shadow-lg' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${
                    index === activeIndex ? 'text-slate-700' : 'text-gray-500'
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
              className="bg-gradient-to-r from-blue-200 to-orange-50 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Step Content */}
          <div className="step-content p-8 bg-white min-h-[600px]">
            {renderStepContent(activeIndex)}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
            <button
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
              }`}
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0}
            >
              <ChevronLeft size={20} className="mr-2" />
              Anterior
            </button>

            <div className="text-sm text-gray-500 font-medium">
              Etapa {activeIndex + 1} de {steps.length}
            </div>

            <button
              className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${
                isLastStep
                  ? 'bg-gradient-to-r from-blue-50 to-orange-50 hover:bg-blue-700 text-slate shadow-lg'
                  : 'bg-gradient-to-r from-blue-50 to-orange-50 hover:bg-blue-700 text-slate shadow-lg'
              }`}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                if (!isLastStep) {
                  if (validateCurrentStep()) {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                    setActiveIndex(prev => prev + 1);
                  } else {
                    showToast('error', 'Validação', 'Por favor, corrija os erros antes de continuar.');
                  }
                } else {
                  if (validateCurrentStep()) {
                    handleSubmit(e);
                  } else {
                    showToast('error', 'Validação', 'Por favor, corrija os erros antes de criar o lote.');
                  }
                }
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Criando Lote...
                </>
              ) : isLastStep ? (
                <>
                  <Package size={20} className="mr-2" />
                  Criar Lote
                </>
              ) : (
                <>
                  <span className="mr-2">Próximo</span>
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}