import { AlertCircle, ArrowLeft, BookOpen, Building, DollarSign, Edit, Layers, MapPin, Save, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';
import api from '../../../../core/services/api';

const VisualizarProjeto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [projeto, setProjeto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Opções de províncias e tipos de crédito/apoio (iguais ao cadastro)
  const provinciasOptions = [
    { label: 'Luanda', value: 'LUANDA' },
    { label: 'Benguela', value: 'BENGUELA' },
    { label: 'Huila', value: 'HUILA' },
    { label: 'Cuando Cubango', value: 'CUANDO_CUBANGO' },
    { label: 'Namibe', value: 'NAMIBE' },
    { label: 'Bié', value: 'BIE' },
    { label: 'Cabinda', value: 'CABINDA' },
    { label: 'Cunene', value: 'CUNENE' },
    { label: 'Huambo', value: 'HUAMBO' },
    { label: 'Lunda Norte', value: 'LUNDA_NORTE' },
    { label: 'Lunda Sul', value: 'LUNDA_SUL' },
    { label: 'Malanje', value: 'MALANJE' },
    { label: 'Moxico', value: 'MOXICO' },
    { label: 'Uige', value: 'UIGE' },
    { label: 'Zaire', value: 'ZAIRE' },
    { label: 'Bengo', value: 'BENGO' },
    { label: 'Cuanza Norte', value: 'CUANZA_NORTE' },
    { label: 'Cuanza Sul', value: 'CUANZA_SUL' }
  ];
  const tiposCreditoOptions = [
    { label: 'Crédito Subsidiado', value: 'CREDITO_SUBSIDIADO' },
    { label: 'Empréstimo Concessional', value: 'EMPRESTIMO_CONCESSIONAL' },
    { label: 'Doação/Grant', value: 'DOACAO' },
    { label: 'Contrapartida Local', value: 'CONTRAPARTIDA_LOCAL' },
    { label: 'Investimento Direto', value: 'INVESTIMENTO_DIRETO' },
    { label: 'Financiamento Misto', value: 'FINANCIAMENTO_MISTO' },
    { label: 'Microcrédito', value: 'MICROCREDITO' },
    { label: 'Fundo Rotativo', value: 'FUNDO_ROTATIVO' },
    { label: 'Assistência Técnica', value: 'ASSISTENCIA_TECNICA' },
    { label: 'Capacitação', value: 'CAPACITACAO' },
    { label: 'Equipamentos', value: 'EQUIPAMENTOS' },
    { label: 'Infraestrutura', value: 'INFRAESTRUTURA' },
    { label: 'Sementes e Insumos', value: 'SEMENTES_INSUMOS' },
    { label: 'Apoio à Comercialização', value: 'APOIO_COMERCIALIZACAO' }
  ];

  // Opções de fases do projeto
  const fasesProjetoOptions = [
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

  // Função para obter labels selecionados
  const getSelectedLabels = (selected, options) => {
    if (!selected || !Array.isArray(selected)) return [];
    return options.filter(opt => selected.includes(opt.value)).map(opt => opt.label);
  };

  useEffect(() => {
    const fetchProjeto = async () => {
      try {
        const { data } = await api.get(`/projetoBeneficiario/${id}`);
        setProjeto(data);
        setFormData(data);
      } catch (error) {
        setErro('Erro ao carregar projeto.');
        console(error)
      } finally {
        setLoading(false);
      }
    };
    fetchProjeto();
  }, [id]);

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'numeroBeneficiarios') {
      formattedValue = value === '' ? '' : parseInt(value, 10);
    } else if (field === 'valorGlobalProjeto') {
      formattedValue = value === '' ? '' : parseFloat(value);
    } else if (field === 'provinciasAbrangidas' || field === 'tipoCredito') {
      formattedValue = Array.isArray(value) ? value : [value];
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  const showToast = (severity, summary, detail, duration = 4000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleSave = async () => {
    setSaving(true);

    // Garante que os dados numéricos estejam corretos antes de enviar
    const payload = {
      ...formData,
      numeroBeneficiarios: formData.numeroBeneficiarios === '' ? null : String(formData.numeroBeneficiarios),
      valorGlobalProjeto: formData.valorGlobalProjeto === '' ? null : String(formData.valorGlobalProjeto),
      provinciasAbrangidas: Array.isArray(formData.provinciasAbrangidas)
        ? formData.provinciasAbrangidas.map(item => typeof item === 'string' ? item : item.value)
        : [],
      tipoCredito: Array.isArray(formData.tipoCredito)
        ? formData.tipoCredito.map(item => typeof item === 'string' ? item : item.value)
        : [],
    };

    try {
      console.log('Payload enviado para o backend:', payload);
      await api.put(`/projetoBeneficiario/${id}`, payload);
      setProjeto(payload);
      setEditMode(false);
      showToast('success', 'Sucesso!', 'Alterações salvas com sucesso!');
    } catch (error) {
      showToast('error', 'Erro', 'Erro ao salvar alterações.');
      if (error.response?.data?.errors) {
        // Mostra a primeira mensagem de erro de validação, se houver
        const errors = error.response.data.errors;
        const firstKey = Object.keys(errors)[0];
        if (errors[firstKey] && errors[firstKey][0]) {
          showToast('error', 'Erro de Validação', errors[firstKey][0]);
        }
      }
    } finally {
      setSaving(false);
    }
  };

  //Modal cancelar

  const handleCancelEdit = () => {
    setShowCancelModal(true);
  };



  const confirmCancelEdit = () => {
    setEditMode(false);
    setFormData(projeto);
    setShowCancelModal(false);
    showToast('info', 'Edição cancelada - Alterações descartadas');
  };



  if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>;
  if (erro) return <div className="p-8 text-center text-red-500">{erro}</div>;
  if (!projeto) return <div className="p-8 text-center text-gray-500">Projeto não encontrado.</div>;

  const provincias = Array.isArray(projeto.provinciasAbrangidas)
    ? projeto.provinciasAbrangidas
    : (typeof projeto.provinciasAbrangidas === 'string' && projeto.provinciasAbrangidas.length > 0)
      ? projeto.provinciasAbrangidas.split(',')
      : [];

  return (
    <div className="  bg-gray-50 mx-auto px-4 py-6 ">
      <div className="container mx-auto ">
        {/* Toast Message igual ao do cadastro */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
            toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
              'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
            }`}>
            <div className="flex items-center">
              <div className="mr-3">
                {toastMessage.severity === 'success' && <Save size={20} />}
                {toastMessage.severity === 'error' && <X size={20} />}
                {toastMessage.severity === 'info' && <Edit size={20} />}
              </div>
              <div>
                <p className="font-bold">{toastMessage.summary}</p>
                <p className="text-sm">{toastMessage.detail}</p>
              </div>
            </div>
          </div>
        )}

        {/* Cabeçalho */}
        <div className="bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Voltar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className='fex-col '>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Detalhes do Projecto
                </h1>

                <span className="text-gray-600 ">Código do Projecto: <span >{projeto.id}</span></span>
              </div>
            </div>

          </div>
          <div className="flex gap-3">
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Edit className="w-5 h-5" />
                Editar
              </button>
            )}
            {editMode && (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
                >
                  <Save className="w-5 h-5" />
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                >
                  <X className="w-5 h-5" /> Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        {/* Grid de informações principais em formato de formulário */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4">Informações do Projecto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4 text-sm">
              {/* Nome do Projeto */}
              <CustomInput
                type="text"
                label="Nome do Projecto"
                value={editMode ? formData.nomeProjeto || '' : projeto.nomeProjeto || ''}
                onChange={value => handleInputChange('nomeProjeto', value)}
                disabled={!editMode}
                iconStart={<BookOpen size={18} />}
              />
              {/* Número de Beneficiários */}
              <CustomInput
                type="text"
                label="Número de Beneficiários"
                value={editMode ? formData.numeroBeneficiarios || '' : projeto.numeroBeneficiarios || ''}
                onChange={value => handleInputChange('numeroBeneficiarios', value)}
                disabled={!editMode}
                iconStart={<Users size={18} />}
              />
              {/* Valor Global do Projeto */}
              <CustomInput
                type="text"
                label="Valor Global do Projecto"
                value={editMode ? formData.valorGlobalProjeto || '' : projeto.valorGlobalProjeto || ''}
                onChange={value => handleInputChange('valorGlobalProjeto', value)}
                disabled={!editMode}
                iconStart={<DollarSign size={18} />}
              />
              {/* Fase do Projeto */}
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Fase do Projecto</span>
                {editMode ? (
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Layers size={18} className="text-gray-400" />
                    </span>
                    <select
                      value={formData.faseProjeto || ''}
                      onChange={e => handleInputChange('faseProjeto', e.target.value)}
                      className="block w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    >
                      <option value="">Selecione a fase do projecto</option>
                      {fasesProjetoOptions.map(fase => (
                        <option key={fase.value} value={fase.value}>{fase.label}</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mt-1 flex items-center gap-1">
                    <Layers size={14} className="text-gray-400" />
                    {(() => {
                      const fase = fasesProjetoOptions.find(f => f.value === projeto.faseProjeto);
                      return fase ? (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">{fase.label}</span>
                      ) : (
                        <span className="text-gray-500">Não informado</span>
                      );
                    })()}
                  </div>
                )}
              </label>

            </div>
            {/* Províncias Abrangidas */}
            <div className="flex flex-col gap-4">

              <label className="text-sm font-medium text-gray-700">Províncias Abrangidas
                {editMode ? (
                  <CustomInput
                    type="multiselect"
                    value={formData.provinciasAbrangidas || []}
                    options={provinciasOptions}
                    onChange={value => handleInputChange('provinciasAbrangidas', value)}
                    required
                    helperText="Selecione uma ou mais províncias onde o projeto será implementado"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {getSelectedLabels(
                      Array.isArray(projeto.provinciasAbrangidas)
                        ? projeto.provinciasAbrangidas
                        : typeof projeto.provinciasAbrangidas === 'string'
                          ? projeto.provinciasAbrangidas.split(',')
                          : [],
                      provinciasOptions
                    ).map((label, idx) => (
                      <span key={`provincia-${label}-${idx}`} className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1"><MapPin size={14} />{label}</span>
                    ))}

                  </div>
                )}
              </label>
              {/* Tipos de Crédito/Apoio */}
              <label className="text-sm font-medium text-gray-700">Tipos de Crédito/Apoio
                {editMode ? (
                  <CustomInput
                    type="multiselect"
                    value={formData.tipoCredito || []}
                    options={tiposCreditoOptions}
                    onChange={value => handleInputChange('tipoCredito', value)}
                    required
                    helperText="Selecione um ou mais tipos de apoio que o projeto oferecerá"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {getSelectedLabels(projeto.tipoCredito, tiposCreditoOptions).map((label, idx) => (
                      <span key={`tipoCredito-${label}-${idx}`} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">{label}</span>
                    ))}
                  </div>
                )}
              </label>
              <CustomInput
                type="text"
                label="Entidade Implementadora"
                value={editMode ? formData.entidadeImplementadora || '' : projeto.entidadeImplementadora || ''}
                onChange={value => handleInputChange('entidadeImplementadora', value)}
                disabled={!editMode}
                iconStart={<Building size={18} />}
              />
            </div>
          </div>
        </div>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Cancelamento</h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Tem certeza que deseja cancelar? <br />Os dados não salvos serão perdidos.
              </p>
              <div className="flex gap-3 mt-2 w-full">
                <button
                  onClick={confirmCancelEdit}
                  className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Sim, cancelar
                </button>
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Não
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizarProjeto; 