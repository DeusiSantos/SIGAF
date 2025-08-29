import React, { useState, useEffect } from 'react';
import {
  Building,
  Users,
  DollarSign,
  Info,
  Loader,
  Layers,
  BookOpen,
  AlertCircle,
  CheckCircle,
  Trash2
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';
import api from '../../services/api'
import { useLocation, useNavigate } from 'react-router-dom';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

// Dados das províncias
const provinciasData = [
  { nome: 'Luanda', value: 'LUANDA' },
  { nome: 'Benguela', value: 'BENGUELA' },
  { nome: 'Huila', value: 'HUILA' },
  { nome: 'Cuando Cubango', value: 'CUANDO_CUBANGO' },
  { nome: 'Namibe', value: 'NAMIBE' },
  { nome: 'Bié', value: 'BIE' },
  { nome: 'Cabinda', value: 'CABINDA' },
  { nome: 'Cunene', value: 'CUNENE' },
  { nome: 'Huambo', value: 'HUAMBO' },
  { nome: 'Lunda Norte', value: 'LUNDA_NORTE' },
  { nome: 'Lunda Sul', value: 'LUNDA_SUL' },
  { nome: 'Malanje', value: 'MALANJE' },
  { nome: 'Moxico', value: 'MOXICO' },
  { nome: 'Uige', value: 'UIGE' },
  { nome: 'Zaire', value: 'ZAIRE' },
  { nome: 'Bengo', value: 'BENGO' },
  { nome: 'Cuanza Norte', value: 'CUANZA_NORTE' },
  { nome: 'Cuanza Sul', value: 'CUANZA_SUL' }
];

// Fases do projeto
const fasesProjeto = [
  { label: 'Fase 1 - Planejamento', value: 'PLANEJAMENTO' },
  { label: 'Fase 2 - Aprovação', value: 'APROVACAO' },
  { label: 'Fase 3 - Mobilização', value: 'MOBILIZACAO' },
  { label: 'Fase 4 - Implementação Inicial', value: 'IMPLEMENTACAO_INICIAL' },
  { label: 'Fase 5 - Desenvolvimento', value: 'DESENVOLVIMENTO' },
  { label: 'Fase 6 - Monitoramento', value: 'MONITORAMENTO' },
  { label: 'Fase 7 - Avaliação Intermediária', value: 'AVALIACAO_INTERMEDIARIA' },
  { label: 'Fase 8 - Ajustes', value: 'AJUSTES' },
  { label: 'Fase 9 - Finalização', value: 'FINALIZACAO' },
  { label: 'Fase 10 - Encerramento', value: 'ENCERRAMENTO' }
];

// Tipos de crédito/apoio
const tiposCreditoOptions = [
  { label: 'Crédito Agrícola', value: 'CREDITO_AGRICOLA' },
  { label: 'Assistência Técnica', value: 'ASSISTENCIA_TECNICA' },
  { label: 'Fornecimento de Sementes', value: 'SEMENTES' },
  { label: 'Equipamentos Agrícolas', value: 'EQUIPAMENTOS' },
  { label: 'Capacitação e Treinamento', value: 'CAPACITACAO' },
  { label: 'Infraestrutura Rural', value: 'INFRAESTRUTURA' },
  { label: 'Apoio à Comercialização', value: 'COMERCIALIZACAO' },
  { label: 'Processamento de Produtos', value: 'PROCESSAMENTO' },
  { label: 'Sistemas de Irrigação', value: 'IRRIGACAO' },
  { label: 'Desenvolvimento Pecuário', value: 'PECUARIA' },
  { label: 'Microfinanças', value: 'MICROFINANCAS' },
  { label: 'Segurança Alimentar', value: 'SEGURANCA_ALIMENTAR' }
];

// Estado inicial padrão do formulário
const initialFormState = {
  NomeProjeto: '',
  NumeroBeneficiarios: '',
  FaseProjeto: '',
  ValorGlobalProjeto: '',
  ProvinciasAbrangidas: [],
  entidadeImplementadora: '',
  tipoCredito: []
};

const CadastroProjetos = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const projetoEditando = location.state?.projetoEditando || null;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    NomeProjeto: '',
    NumeroBeneficiarios: '',
    FaseProjeto: '',
    ValorGlobalProjeto: '',
    ProvinciasAbrangidas: [],
    entidadeImplementadora: '',
    tipoCredito: []
  });

  // Limpar formulário ao montar o componente
  useEffect(() => {
    // Limpa o formulário ao montar
    setFormData({
      NomeProjeto: '',
      NumeroBeneficiarios: '',
      FaseProjeto: '',
      ValorGlobalProjeto: '',
      ProvinciasAbrangidas: [],
      entidadeImplementadora: '',
      tipoCredito: []
    });
  }, []); // Executa apenas ao montar o componente

  // Preencher formulário se for edição ou limpar se for novo
  useEffect(() => {
    if (projetoEditando) {
      setFormData({
        NomeProjeto: projetoEditando.nomeProjeto || '',
        NumeroBeneficiarios: projetoEditando.numeroBeneficiarios || '',
        FaseProjeto: projetoEditando.faseProjeto || '',
        ValorGlobalProjeto: projetoEditando.valorGlobalProjeto || '',
        ProvinciasAbrangidas: projetoEditando.provinciasAbrangidas || [],
        entidadeImplementadora: projetoEditando.entidadeImplementadora || '',
        tipoCredito: projetoEditando.tipoCredito || []
      });
    } else {
      // Se for novo cadastro, limpa o formulário
      setFormData(initialFormState);
    }

    // Limpa o state da navegação para evitar reuso indevido
    if (!projetoEditando && location.state) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [projetoEditando, navigate, location.pathname]);

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    // Garantir tipos corretos conforme especificação
    let processedValue = value;
    
    if (field === 'ProvinciasAbrangidas' || field === 'tipoCredito') {
      processedValue = Array.isArray(value) ? value : [];
    } else if (field === 'NomeProjeto' || field === 'NumeroBeneficiarios' || 
               field === 'FaseProjeto' || field === 'ValorGlobalProjeto' || 
               field === 'entidadeImplementadora') {
      processedValue = String(value || '');
    }
    
    setFormData(prev => ({ ...prev, [field]: processedValue }));
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatCurrency = (value) => {
    if (!value || value === '') return '';
    const numValue = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 2
    }).format(numValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const formatArrayField = (array) =>
      array
        .map(item =>
          typeof item === 'string'
            ? item.trim()
            : item?.value?.trim?.() || ''
        )
        .filter(Boolean);
  
    const dataToSend = {
      id: projetoEditando?.id,
      nomeProjeto: formData.NomeProjeto.trim(),
      numeroBeneficiarios: formData.NumeroBeneficiarios.toString().trim(),
      faseProjeto: formData.FaseProjeto.trim(),
      valorGlobalProjeto: formData.ValorGlobalProjeto.toString().trim(),
      provinciasAbrangidas: formatArrayField(formData.ProvinciasAbrangidas),
      entidadeImplementadora: formData.entidadeImplementadora.trim(),
      tipoCredito: formatArrayField(formData.tipoCredito)
    };
  
    try {
      if (projetoEditando) {
        await api.patch(`/projetoBeneficiario/${dataToSend.id}`, dataToSend);
        showToast('success', 'Sucesso!', 'Projeto atualizado com sucesso!');
      } else {
        await api.post('/projetoBeneficiario', dataToSend);
        showToast('success', 'Sucesso!', 'Projeto cadastrado com sucesso!');
      }
  
      // Limpa o formulário após salvar
      setFormData(initialFormState);
  
      setErrors({});
      setTimeout(() => navigate(-1), 1000); // Volta para a tela anterior
  
    } catch (error) {
      console(error)
      showToast('error', 'Erro', 'Erro ao salvar projeto. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
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

      <div className=" mx-auto ">
        <div className="bg-white text-left">
          {/* Header */}
          <div className="text-center p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Projectos</h1>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Nome do Projeto */}
              <div className="lg:col-span-2">
                <CustomInput
                  type="text"
                  label="Nome do Projecto"
                  value={formData.NomeProjeto}
                  onChange={(value) => handleInputChange('NomeProjeto', value)}
                  required
                  errorMessage={errors.NomeProjeto}
                  placeholder="Digite o nome completo do projecto"
                  iconStart={<BookOpen size={18} />}
                />
              </div>

              {/* Número de Beneficiários */}
              <CustomInput
                type="text"
                label="Número de Beneficiários"
                value={formData.NumeroBeneficiarios}
                onChange={(value) => handleInputChange('NumeroBeneficiarios', value)}
                required
                errorMessage={errors.NumeroBeneficiarios}
                placeholder="Ex: 1500"
                iconStart={<Users size={18} />}
                helperText="Digite apenas números (quantidade de pessoas/famílias beneficiadas)"
              />

              {/* Fase do Projeto */}
              <div className="space-y-2">
                <label className="block text-left text-sm font-semibold text-gray-700">
                  Fase do Projecto <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers size={18} className="text-gray-400" />
                  </div>
                  <select
                    value={formData.FaseProjeto}
                    onChange={(e) => handleInputChange('FaseProjeto', e.target.value)}
                    className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.FaseProjeto 
                        ? 'border-red-300 bg-red-50' 
                        : 'border-gray-300 bg-white hover:border-gray-400'
                    }`}
                    required
                  >
                    <option value="">Selecione a fase atual do projecto</option>
                    {fasesProjeto.map((fase) => (
                      <option key={fase.value} value={fase.value}>
                        {fase.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.FaseProjeto && (
                  <p className="text-sm text-red-600 flex items-center mt-1">
                    <AlertCircle size={16} className="mr-1" />
                    {errors.FaseProjeto}
                  </p>
                )}
              </div>

              {/* Valor Global do Projeto */}
              <CustomInput
                type="text"
                label="Valor Global do Projecto (AOA)"
                value={formData.ValorGlobalProjeto}
                onChange={(value) => handleInputChange('ValorGlobalProjeto', value)}
                required
                errorMessage={errors.ValorGlobalProjeto}
                placeholder="Ex: 15000000.00"
                iconStart={<DollarSign size={18} />}
                helperText={formData.ValorGlobalProjeto ? 
                  `Valor formatado: ${formatCurrency(formData.ValorGlobalProjeto)}` : 
                  'Digite o valor em Kwanzas (apenas números e ponto decimal)'
                }
              />

              {/* Entidade Implementadora */}
              <CustomInput
                type="text"
                label="Entidade Implementadora"
                value={formData.entidadeImplementadora}
                onChange={(value) => handleInputChange('entidadeImplementadora', value)}
                required
                errorMessage={errors.entidadeImplementadora}
                placeholder="Nome da organização/instituição responsável"
                iconStart={<Building size={18} />}
              />

              {/* Províncias Abrangidas */}
              <div className="lg:col-span-2">
                <CustomInput
                  type="multiselect"
                  label="Províncias Abrangidas"
                  value={formData.ProvinciasAbrangidas}
                  options={provinciasData.map(provincia => ({
                    label: provincia.nome,
                    value: provincia.value
                  }))}
                  onChange={(value) => handleInputChange('ProvinciasAbrangidas', value)}
                  required
                  errorMessage={errors.ProvinciasAbrangidas}
                  helperText="Selecione uma ou mais províncias onde o projeto será implementado"
                />
              </div>

              {/* Tipo de Crédito/Apoio */}
              <div className="lg:col-span-2">
                <CustomInput
                  type="multiselect"
                  label="Tipos de Crédito/Apoio"
                  value={formData.tipoCredito}
                  options={tiposCreditoOptions}
                  onChange={(value) => handleInputChange('tipoCredito', value)}
                  required
                  errorMessage={errors.tipoCredito}
                  helperText="Selecione um ou mais tipos de apoio que o projeto oferecerá"
                />
              </div>
            </div>

            {/* Resumo dos Dados */}
            {(formData.NomeProjeto || formData.NumeroBeneficiarios || formData.ValorGlobalProjeto) && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Resumo do Projeto
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  
                  {formData.NomeProjeto && (
                    <div className="bg-white p-3 rounded-lg">
                      <span className="block font-semibold text-blue-700">Projeto:</span>
                      <span className="text-blue-600">{formData.NomeProjeto}</span>
                    </div>
                  )}
                  
                  {formData.NumeroBeneficiarios && (
                    <div className="bg-white p-3 rounded-lg">
                      <span className="block font-semibold text-blue-700">Beneficiários:</span>
                      <span className="text-blue-600">
                        {parseInt(formData.NumeroBeneficiarios).toLocaleString()} pessoas
                      </span>
                    </div>
                  )}
                  
                  {formData.ValorGlobalProjeto && (
                    <div className="bg-white p-3 rounded-lg">
                      <span className="block font-semibold text-blue-700">Valor:</span>
                      <span className="text-blue-600">{formatCurrency(formData.ValorGlobalProjeto)}</span>
                    </div>
                  )}
                  
                  {formData.FaseProjeto && (
                    <div className="bg-white p-3 rounded-lg">
                      <span className="block font-semibold text-blue-700">Fase:</span>
                      <span className="text-blue-600">
                        {fasesProjeto.find(f => f.value === formData.FaseProjeto)?.label || formData.FaseProjeto}
                      </span>
                    </div>
                  )}
                  
                  {formData.ProvinciasAbrangidas.length > 0 && (
                    <div className="bg-white p-3 rounded-lg">
                      <span className="block font-semibold text-blue-700">Províncias:</span>
                      <span className="text-blue-600">
                        {formData.ProvinciasAbrangidas.length} selecionada(s)
                      </span>
                    </div>
                  )}
                  
                  {formData.tipoCredito.length > 0 && (
                    <div className="bg-white p-3 rounded-lg">
                      <span className="block font-semibold text-blue-700">Tipos de Apoio:</span>
                      <span className="text-blue-600">
                        {formData.tipoCredito.length} selecionado(s)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botão de Envio */}
            <div className="mt-8 flex justify-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`px-16 py-4 rounded-xl flex items-center transition-all font-semibold text-lg shadow-lg ${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed text-gray-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {loading ? (
                  <>
                    <Loader size={24} className="animate-spin mr-3" />
                    {projetoEditando ? 'Salvando Alterações...' : 'Cadastrando Projeto...'}
                  </>
                ) : (
                  <>
                    <BookOpen size={24} className="mr-3" />
                    {projetoEditando ? 'Salvar Alterações' : 'Cadastrar Projeto'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};

export default CadastroProjetos;