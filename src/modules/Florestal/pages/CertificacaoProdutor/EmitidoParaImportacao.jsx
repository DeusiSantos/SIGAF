import axios from 'axios';
import {
  AlertCircle,
  Building,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Info,
  Loader,
  MapPin,
  Package,
  Plus,
  Search,
  Trash2,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import CustomInput from '../../../../core/components/CustomInput';
import provinciasData from '../../../../core/components/Provincias.json';
import { gerarAutorizacaoDesalfandegamento } from './AutorizacaoDesalfandegamentoDocument';

// Hook para buscar produtores do RNPA
const useProdutoresRNPA = () => {
  const [loading, setLoading] = useState(true);
  const [produtores, setProdutores] = useState([]);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/produtorFlorestal/all');
        const data = await response.json();

        // Mapear os dados da API para o formato esperado
        const produtoresMapeados = data.map(p => ({
          id: p._id,
          nome: p.nome_do_Produtor || 'Sem nome',
          bi: p.bI_NIF || 'Sem BI/NIF',
          provincia: p.provincia || '',
          municipio: p.municipio || '',
          comuna: p.comuna || '',
          telefone: p.contacto || '',
          email: p.e_mail || '',
          genero: p.g_nero || '',
          dataNascimento: p.data_de_Nascimento || '',
          localizacaoGPS: p.localiza_o_GPS || ''
        }));

        setProdutores(produtoresMapeados);
        console.log('✅ Produtores carregados:', produtoresMapeados.length);
      } catch (error) {
        console.error('❌ Erro ao buscar produtores RNPA:', error);
        setProdutores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtores, loading };
};

const RegistroMercadorias = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isProdutorExistente, setIsProdutorExistente] = useState(null);
  const [produtorSelecionado, setProdutorSelecionado] = useState(null);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [mercadorias, setMercadorias] = useState([]);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Hook para buscar produtores
  const { produtores: produtoresRNPA, loading: loadingProdutores } = useProdutoresRNPA();

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    nif: '',
    endereco: '',
    provincia: '',
    municipio: '',
    produtorId: null
  });

  const steps = [
    { label: 'Tipo de Registro', icon: Search },
    { label: 'Dados do Fornecedor', icon: User },
    { label: 'Mercadorias', icon: Package },
    { label: 'Resumo', icon: CheckCircle }
  ];

  const moedasOptions = [
    { label: 'AOA - Kwanza', value: 'AOA' },
    { label: 'USD - Dólar', value: 'USD' },
    { label: 'EUR - Euro', value: 'EUR' }
  ];

  const showToast = (severity, summary, detail) => {
    setToastMessage({ severity, summary, detail });
    setTimeout(() => setToastMessage(null), 3000);
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

  const handleProvinciaChange = (value) => {
    const provinciaValue = typeof value === 'object' ? value.value : value;
    handleInputChange('provincia', provinciaValue);
    handleInputChange('municipio', '');

    const provinciaSelected = provinciasData.find(
      p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
    );

    if (provinciaSelected) {
      try {
        const municipiosArray = JSON.parse(provinciaSelected.municipios);
        const municipios = municipiosArray.map(mun => ({
          label: mun,
          value: mun
        }));
        setMunicipiosOptions(municipios);
      } catch (error) {
        console.error("Erro ao processar municípios:", error);
        setMunicipiosOptions([]);
      }
    } else {
      setMunicipiosOptions([]);
    }
  };

  // Função para buscar e selecionar produtor
  const buscarProdutor = (produtorOption) => {
    const produtorId = typeof produtorOption === 'object' ? produtorOption.value : produtorOption;
    const produtor = produtoresRNPA.find(p => p.id === parseInt(produtorId));

    if (produtor) {
      setProdutorSelecionado(produtor);

      setFormData(prev => ({
        ...prev,
        nome: produtor.nome || '',
        nif: produtor.bi || '',
        telefone: produtor.telefone || '',
        provincia: produtor.provincia || '',
        municipio: produtor.municipio || '',
        comuna: produtor.comuna || '',
        produtorId: produtor.id
      }));

      // Carregar municípios da província do produtor
      if (produtor.provincia) {
        const provinciaSelected = provinciasData.find(
          p => p.nome.toUpperCase() === produtor.provincia?.toUpperCase()
        );
        if (provinciaSelected) {
          try {
            const municipiosArray = JSON.parse(provinciaSelected.municipios);
            const municipios = municipiosArray.map(mun => ({
              label: mun,
              value: mun
            }));
            setMunicipiosOptions(municipios);
          } catch (error) {
            console.error("Erro ao processar municípios:", error);
          }
        }
      }

      showToast('success', 'Produtor Encontrado', `Produtor ${produtor.nome} selecionado com sucesso!`);
    }
  };

  // Preparar opções para o select de produtores
  const produtoresOptions = produtoresRNPA
    .filter(p => p && p.id && p.nome && p.bi)
    .map(p => ({
      label: `${p.nome} - ${p.bi}`,
      value: p.id.toString()
    }));

  // Funções para gerenciar mercadorias
  const adicionarMercadoria = () => {
    const novaMercadoria = {
      id: Date.now(),
      mercadoria: '',
      quantidade: '',
      valor: '',
      moeda: 'AOA',
      origem: ''
    };
    setMercadorias([...mercadorias, novaMercadoria]);
  };

  const removerMercadoria = (id) => {
    setMercadorias(mercadorias.filter(item => item.id !== id));
  };

  const atualizarMercadoria = (id, campo, valor) => {
    setMercadorias(mercadorias.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  const calcularTotalMercadorias = () => {
    return mercadorias.reduce((total, item) => {
      const valor = parseFloat(item.valor) || 0;
      const quantidade = parseFloat(item.quantidade) || 0;
      return total + (valor * quantidade);
    }, 0);
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Tipo de Registro
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Search className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Tipo de Registro</h3>
              </div>
              <p className="text-gray-600">
                Selecione se o fornecedor já está registado como produtor ou é um novo fornecedor.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  className={`p-8 rounded-xl border-2 transition-all text-center hover:shadow-lg ${isProdutorExistente === true
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-green-300'
                    }`}
                  onClick={() => {
                    setIsProdutorExistente(true);
                    setProdutorSelecionado(null);
                    setFormData({
                      nome: '',
                      nif: '',
                      endereco: '',
                      provincia: '',
                      municipio: '',
                      produtorId: null
                    });
                  }}
                >
                  <User size={48} className="mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2">Produtor Existente</h4>
                  <p className="text-sm text-gray-600">
                    Selecione um produtor já registado no RNPA
                  </p>
                </button>

                <button
                  className={`p-8 rounded-xl border-2 transition-all text-center hover:shadow-lg ${isProdutorExistente === false
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300'
                    }`}
                  onClick={() => {
                    setIsProdutorExistente(false);
                    setProdutorSelecionado(null);
                    setFormData({
                      nome: '',
                      nif: '',
                      endereco: '',
                      provincia: '',
                      municipio: '',
                      produtorId: null
                    });
                  }}
                >
                  <Building size={48} className="mx-auto mb-4" />
                  <h4 className="font-semibold text-lg mb-2">Novo Fornecedor</h4>
                  <p className="text-sm text-gray-600">
                    Registar um novo fornecedor não cadastrado
                  </p>
                </button>
              </div>

              {isProdutorExistente !== null && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-800 font-medium">
                      Tipo selecionado: {isProdutorExistente ? 'Produtor Existente' : 'Novo Fornecedor'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Dados do Fornecedor
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {isProdutorExistente ? 'Selecionar Produtor' : 'Dados do Novo Fornecedor'}
                </h3>
              </div>
              <p className="text-gray-600">
                {isProdutorExistente
                  ? 'Selecione o produtor da lista de produtores registados no RNPA.'
                  : 'Preencha os dados do novo fornecedor.'}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              {isProdutorExistente ? (
                <div>
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">Selecionar Produtor do RNPA</h4>
                  {loadingProdutores ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="animate-spin w-6 h-6 text-green-600 mr-2" />
                      <span className="text-gray-600">Carregando produtores...</span>
                    </div>
                  ) : produtoresOptions.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                      <p className="text-gray-600">Nenhum produtor encontrado no RNPA</p>
                      <p className="text-sm text-gray-500 mt-2">Verifique a conexão com a API</p>
                    </div>
                  ) : (
                    <>
                      <CustomInput
                        type="select"
                        label="Produtor RNPA"
                        value=""
                        options={produtoresOptions}
                        onChange={buscarProdutor}
                        placeholder="Selecione um produtor"
                        iconStart={<User size={18} />}
                      />

                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center text-sm text-blue-700">
                          <Info size={16} className="mr-2" />
                          <span>
                            {produtoresOptions.length} {produtoresOptions.length === 1 ? 'produtor disponível' : 'produtores disponíveis'}
                          </span>
                        </div>
                      </div>

                      {produtorSelecionado && (
                        <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                          <div className="flex items-center mb-4">
                            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                            <h5 className="font-semibold text-green-800 text-lg">Produtor Selecionado</h5>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Nome:</span>
                              <p className="font-semibold text-gray-800 mt-1">{produtorSelecionado.nome}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">BI/NIF:</span>
                              <p className="font-semibold text-gray-800 mt-1">{produtorSelecionado.bi}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Província:</span>
                              <p className="font-semibold text-gray-800 mt-1">{produtorSelecionado.provincia || 'Não informado'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Município:</span>
                              <p className="font-semibold text-gray-800 mt-1">{produtorSelecionado.municipio || 'Não informado'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">Telefone:</span>
                              <p className="font-semibold text-gray-800 mt-1">{produtorSelecionado.telefone || 'Não informado'}</p>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-sm">
                              <span className="text-xs text-gray-500 uppercase tracking-wide">ID RNPA:</span>
                              <p className="font-semibold text-gray-800 mt-1">#{produtorSelecionado.id}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.nome}
                      onChange={(value) => handleInputChange('nome', value)}
                      required
                      errorMessage={errors.nome}
                      placeholder="Digite o nome completo do fornecedor"
                      iconStart={<User size={18} />}
                    />
                  </div>

                  <CustomInput
                    type="text"
                    label="NIF"
                    value={formData.nif}
                    onChange={(value) => handleInputChange('nif', value)}
                    required
                    errorMessage={errors.nif}
                    placeholder="Digite o NIF"
                    iconStart={<Info size={18} />}
                  />

                  <CustomInput
                    type="text"
                    label="Endereço"
                    value={formData.endereco}
                    onChange={(value) => handleInputChange('endereco', value)}
                    required
                    errorMessage={errors.endereco}
                    placeholder="Digite o endereço completo"
                    iconStart={<MapPin size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Província"
                    value={formData.provincia ? { label: formData.provincia, value: formData.provincia } : null}
                    options={provinciasData.map(provincia => ({
                      label: provincia.nome,
                      value: provincia.nome
                    }))}
                    onChange={(value) => handleProvinciaChange(value)}
                    required
                    errorMessage={errors.provincia}
                    placeholder="Selecione a província"
                    iconStart={<MapPin size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Município"
                    value={formData.municipio ? { label: formData.municipio, value: formData.municipio } : null}
                    options={municipiosOptions}
                    onChange={(value) => handleInputChange('municipio', typeof value === 'object' ? value.value : value)}
                    required
                    errorMessage={errors.municipio}
                    disabled={!formData.provincia}
                    placeholder="Selecione o município"
                    iconStart={<MapPin size={18} />}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Mercadorias (continua igual...)
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Mercadorias</h3>
              </div>
              <p className="text-gray-600">
                Registre as mercadorias fornecidas com quantidades, valores e origens.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Lista de Mercadorias</h4>
                <button
                  onClick={adicionarMercadoria}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Mercadoria
                </button>
              </div>

              {mercadorias.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Mercadoria</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Quantidade</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Valor Unitário</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Moeda</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Origem</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Total</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mercadorias.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.mercadoria}
                              onChange={(e) => atualizarMercadoria(item.id, 'mercadoria', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Nome da mercadoria"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.quantidade}
                              onChange={(e) => atualizarMercadoria(item.id, 'quantidade', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.01"
                              min="0"
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.valor}
                              onChange={(e) => atualizarMercadoria(item.id, 'valor', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.moeda}
                              onChange={(e) => atualizarMercadoria(item.id, 'moeda', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              {moedasOptions.map(moeda => (
                                <option key={moeda.value} value={moeda.value}>
                                  {moeda.value}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.origem}
                              onChange={(e) => atualizarMercadoria(item.id, 'origem', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Origem"
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-right font-medium">
                            {((parseFloat(item.quantidade) || 0) * (parseFloat(item.valor) || 0)).toLocaleString('pt-AO', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })}
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerMercadoria(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover mercadoria"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma mercadoria registada</p>
                  <p className="text-sm">Clique em "Adicionar Mercadoria" para começar</p>
                </div>
              )}

              {mercadorias.length > 0 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-blue-800">Total Geral:</span>
                    <span className="text-xl font-bold text-blue-900">
                      {calcularTotalMercadorias().toLocaleString('pt-AO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} AOA
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Resumo
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Resumo do Registro</h3>
              </div>
              <p className="text-gray-600">
                Revise todas as informações antes de finalizar o registro.
              </p>
            </div>

            <div className="space-y-6">
              {/* Dados do Fornecedor */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Fornecedor</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Tipo:</span>
                    <p className="font-semibold text-gray-800">
                      {isProdutorExistente ? 'Produtor Existente (RNPA)' : 'Novo Fornecedor'}
                    </p>
                  </div>

                  {isProdutorExistente && produtorSelecionado ? (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">Nome:</span>
                        <p className="font-semibold text-gray-800">{produtorSelecionado.nome}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">BI/NIF:</span>
                        <p className="font-semibold text-gray-800">{produtorSelecionado.bi}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Província:</span>
                        <p className="font-semibold text-gray-800">{produtorSelecionado.provincia || 'Não informado'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Município:</span>
                        <p className="font-semibold text-gray-800">{produtorSelecionado.municipio || 'Não informado'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">ID RNPA:</span>
                        <p className="font-semibold text-gray-800">#{produtorSelecionado.id}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-sm text-gray-500">Nome:</span>
                        <p className="font-semibold text-gray-800">{formData.nome || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">NIF:</span>
                        <p className="font-semibold text-gray-800">{formData.nif || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Endereço:</span>
                        <p className="font-semibold text-gray-800">{formData.endereco || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Província:</span>
                        <p className="font-semibold text-gray-800">{formData.provincia || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Município:</span>
                        <p className="font-semibold text-gray-800">{formData.municipio || 'N/A'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Resumo das Mercadorias */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Resumo das Mercadorias</h4>

                {mercadorias.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {mercadorias.map((item, index) => (
                        <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                            <div>
                              <span className="text-gray-500">Mercadoria:</span>
                              <p className="font-semibold">{item.mercadoria || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Quantidade:</span>
                              <p className="font-semibold">{item.quantidade || '0'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Valor Unit.:</span>
                              <p className="font-semibold">{item.valor || '0'} {item.moeda}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Origem:</span>
                              <p className="font-semibold">{item.origem || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Total:</span>
                              <p className="font-semibold text-green-600">
                                {((parseFloat(item.quantidade) || 0) * (parseFloat(item.valor) || 0)).toLocaleString('pt-AO', {
                                  minimumFractionDigits: 2
                                })} {item.moeda}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-800">Valor Total:</span>
                        <span className="text-2xl font-bold text-green-900">
                          {calcularTotalMercadorias().toLocaleString('pt-AO', {
                            minimumFractionDigits: 2
                          })} AOA
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-500 py-4">Nenhuma mercadoria registada</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && isProdutorExistente === null) {
      showToast('error', 'Validação', 'Por favor, selecione o tipo de registro.');
      return;
    }

    if (activeStep === 1) {
      if (isProdutorExistente && !produtorSelecionado) {
        showToast('error', 'Validação', 'Por favor, selecione um produtor.');
        return;
      }
      if (!isProdutorExistente && (!formData.nome || !formData.nif || !formData.endereco)) {
        showToast('error', 'Validação', 'Por favor, preencha todos os campos obrigatórios.');
        return;
      }
    }

    if (activeStep === 2 && mercadorias.length === 0) {
      showToast('error', 'Validação', 'Por favor, adicione pelo menos uma mercadoria.');
      return;
    }

    setActiveStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (mercadorias.length === 0) {
        showToast('error', 'Validação', 'Adicione pelo menos uma mercadoria antes de finalizar.');
        setLoading(false);
        return;
      }

      const dadosParaPDF = {
        isProdutorExistente,
        produtorSelecionado,
        formData,
        mercadorias
      };

      // ✅ Montar payload compatível com a API
      const payload = {
        nomeCompleto: isProdutorExistente && produtorSelecionado
          ? produtorSelecionado.nome
          : formData.nome,
        nif: isProdutorExistente && produtorSelecionado
          ? produtorSelecionado.bi
          : formData.nif,
        endereco: isProdutorExistente && produtorSelecionado
          ? `${produtorSelecionado.provincia || ''}, ${produtorSelecionado.municipio || ''}`
          : formData.endereco,
        provincia: isProdutorExistente && produtorSelecionado
          ? produtorSelecionado.provincia
          : formData.provincia,
        municipio: isProdutorExistente && produtorSelecionado
          ? produtorSelecionado.municipio
          : formData.municipio,

        listaDeMercadorias: mercadorias.map(m => ({
          nomeDaMercadoria: m.mercadoria?.trim() || 'Mercadoria não informada',
          quantidade: Number(m.quantidade) || 0,
          valorUnitario: Number(m.valor) || 0,
          moeda: m.moeda || 'AOA',
          origem: m.origem?.trim() || 'Desconhecida',
          total: (Number(m.quantidade) || 0) * (Number(m.valor) || 0)
        })),

        produtorFlorestalId: isProdutorExistente && produtorSelecionado
          ? Number(produtorSelecionado.id)
          : null, // ⚠️ não enviar 0 se o backend não aceita
      };

      console.log('📦 Payload enviado:', payload);

      const response = await axios.post(
        'https://mwangobrainsa-001-site2.mtempurl.com/api/declaracaoFlorestal',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('✅ Sucesso:', response.data);

      const resultado = await gerarAutorizacaoDesalfandegamento(dadosParaPDF);

      console.log('✅ Resultado:', resultado);
      showToast('success', 'Sucesso', 'Declaração florestal registrada com sucesso!');

      // Resetar o formulário
      setTimeout(() => {
        setFormData({
          nome: '',
          nif: '',
          endereco: '',
          provincia: '',
          municipio: '',
          produtorId: null
        });
        setMercadorias([]);
        setActiveStep(0);
        setIsProdutorExistente(null);
        setProdutorSelecionado(null);
      }, 1500);

    } catch (error) {
      console.error('❌ Erro ao registrar declaração florestal:', error);
      const message =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'Erro ao registrar a declaração florestal.';
      showToast('error', 'Erro', message);
    } finally {
      setLoading(false);
    }
  };


  const isLastStep = activeStep === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
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

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Registro de Mercadorias</h1>
            <p className="text-gray-600">Sistema de Registro de Fornecedores e Mercadorias</p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeStep ? 'opacity-50' : ''
                    }`}
                  onClick={() => index <= activeStep && setActiveStep(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index < activeStep ? 'bg-green-500 text-white' :
                    index === activeStep ? 'bg-green-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                    {index < activeStep ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${index === activeStep ? 'text-green-700' : 'text-gray-500'
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
              className="bg-green-600 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Step Content */}
          <div className="step-content p-8 bg-white min-h-[600px]">
            {renderStepContent(activeStep)}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
            <button
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeStep === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                }`}
              onClick={() => {
                setActiveStep((prev) => Math.max(prev - 1, 0));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={activeStep === 0}
            >
              <ChevronLeft size={20} className="mr-2" />
              Anterior
            </button>

            <div className="text-sm text-gray-500 font-medium">
              Etapa {activeStep + 1} de {steps.length}
            </div>

            <button
              className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                }`}
              disabled={loading}
              onClick={() => {
                if (!isLastStep) {
                  handleNext();
                } else {
                  handleSubmit();
                }
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Processando...
                </>
              ) : isLastStep ? (
                <>
                  <CheckCircle size={20} className="mr-2" />
                  Finalizar Registro
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
};

export default RegistroMercadorias;