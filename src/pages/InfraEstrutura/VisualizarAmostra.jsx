import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  X,
  Save,
  AlertCircle,
  TestTube,
  Calendar,
  User,
  Leaf,
  MapPin,
  Layers,
  Droplets,
  Camera,
  FileText
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';

const VisualizarAmostra = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amostra, setAmostra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Opções para os campos
  const profundidadeOptions = [
    { label: "0-15cm", value: "0-15cm" },
    { label: "15-30cm", value: "15-30cm" },
    { label: "30-60cm", value: "30-60cm" },
    { label: "60-100cm", value: "60-100cm" }
  ];

  const metodoColetaOptions = [
    { label: "Tradagem", value: "tradagem" },
    { label: "Perfil de Solo", value: "perfil_solo" },
    { label: "Amostragem Simples", value: "amostragem_simples" },
    { label: "Amostragem Composta", value: "amostragem_composta" }
  ];

  const culturasOptions = [
    { label: "Milho", value: "milho" },
    { label: "Mandioca", value: "mandioca" },
    { label: "Amendoim", value: "amendoim" },
    { label: "Feijões", value: "feijoes" },
    { label: "Batata-doce", value: "batata_doce" },
    { label: "Banana", value: "banana" },
    { label: "Massambala", value: "massambala" },
    { label: "Massango", value: "massango" },
    { label: "Café", value: "cafe" },
    { label: "Cebola", value: "cebola" },
    { label: "Tomate", value: "tomate" },
    { label: "Couve", value: "couve" },
    { label: "Batata Rena", value: "batata_rena" },
    { label: "Trigo", value: "trigo" },
    { label: "Arroz", value: "arroz" },
    { label: "Soja", value: "soja" },
    { label: "Outras", value: "outras" }
  ];

  const tipoSoloOptions = [
    { label: "Arenoso", value: "arenoso" },
    { label: "Argiloso", value: "argiloso" },
    { label: "Franco", value: "franco" },
    { label: "Franco-Arenoso", value: "franco_arenoso" },
    { label: "Franco-Argiloso", value: "franco_argiloso" }
  ];

  const corSoloOptions = [
    { label: "Escuro/Preto", value: "escuro_preto" },
    { label: "Marrom", value: "marrom" },
    { label: "Vermelho", value: "vermelho" },
    { label: "Amarelo", value: "amarelo" },
    { label: "Cinza", value: "cinza" }
  ];

  const texturaOptions = [
    { label: "Muito fina", value: "muito_fina" },
    { label: "Fina", value: "fina" },
    { label: "Média", value: "media" },
    { label: "Grosseira", value: "grosseira" }
  ];

  const drenagemOptions = [
    { label: "Boa", value: "boa" },
    { label: "Moderada", value: "moderada" },
    { label: "Deficiente", value: "deficiente" },
    { label: "Muito Deficiente", value: "muito_deficiente" }
  ];

  const pertenceProdutorOptions = [
    { label: "Sim", value: "sim" },
    { label: "Não", value: "nao" }
  ];

  // Função para obter label de uma opção
  const getLabel = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value || 'N/A';
  };

  // Função para obter labels de múltiplas seleções
  const getSelectedLabels = (selected, options) => {
    if (!selected || !Array.isArray(selected)) return [];
    return options.filter(opt => selected.includes(opt.value)).map(opt => opt.label);
  };

  useEffect(() => {
    const fetchAmostra = async () => {
      try {
        const response = await fetch(`https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/${id}`);
        if (!response.ok) throw new Error('Erro ao buscar amostra');
        const data = await response.json();
        setAmostra(data);
        setFormData(data);
      } catch (error) {
        setErro('Erro ao carregar amostra de solo.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAmostra();
  }, [id]);

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'c_digo_do_') {
      formattedValue = value === '' ? 0 : parseInt(value, 10);
    } else if (field === 'cultura_Actual') {
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

    const payload = {
      ...formData,
      cultura_Actual: Array.isArray(formData.cultura_Actual)
        ? formData.cultura_Actual.map(item => typeof item === 'string' ? item : item.value)
        : [],
    };

    try {
      console.log('📤 Payload enviado:', payload);
      const response = await fetch(`https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar');
      }

      const updatedData = await response.json();
      setAmostra(updatedData);
      setEditMode(false);
      showToast('success', 'Sucesso!', 'Alterações salvas com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      showToast('error', 'Erro', error.message || 'Erro ao salvar alterações.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setShowCancelModal(true);
  };

  const confirmCancelEdit = () => {
    setEditMode(false);
    setFormData(amostra);
    setShowCancelModal(false);
    showToast('info', 'Edição cancelada', 'Alterações descartadas');
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Carregando...</div>;
  if (erro) return <div className="p-8 text-center text-red-500">{erro}</div>;
  if (!amostra) return <div className="p-8 text-center text-gray-500">Amostra não encontrada.</div>;

  return (
    <div className="bg-gray-50 mx-auto px-4 py-6">
      <div className="container mx-auto">
        {/* Toast Message */}
        {toastMessage && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-300 ${
            toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
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
              <div className="flex-col">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <TestTube className="w-6 h-6 text-emerald-600" />
                  Detalhes da Amostra de Solo
                </h1>
                <span className="text-gray-600">ID da Amostra: <span className="font-semibold">#{amostra._id}</span></span>
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

        {/* Informações da Amostra */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <TestTube className="w-5 h-5 text-emerald-600" />
            Informações Gerais
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pertence a Produtor */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Pertence a um Produtor?</span>
              {editMode ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </span>
                  <select
                    value={formData.este_solo_pertence_a_um_produt || ''}
                    onChange={e => handleInputChange('este_solo_pertence_a_um_produt', e.target.value)}
                    className="block w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Selecione</option>
                    {pertenceProdutorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  <User size={14} className="text-gray-400" />
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    amostra.este_solo_pertence_a_um_produt === 'sim' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {getLabel(amostra.este_solo_pertence_a_um_produt, pertenceProdutorOptions)}
                  </span>
                </div>
              )}
            </label>

            {/* Código do Produtor */}
            {(amostra.este_solo_pertence_a_um_produt === 'sim' || formData.este_solo_pertence_a_um_produt === 'sim') && (
              <CustomInput
                type="number"
                label="Código do Produtor"
                value={editMode ? formData.c_digo_do_ || '' : amostra.c_digo_do_ || ''}
                onChange={value => handleInputChange('c_digo_do_', value)}
                disabled={!editMode}
                iconStart={<User size={18} />}
              />
            )}

            {/* Data da Coleta */}
            <CustomInput
              type="date"
              label="Data da Coleta"
              value={editMode ? formData.data_da_Coleta?.split('T')[0] || '' : amostra.data_da_Coleta?.split('T')[0] || ''}
              onChange={value => handleInputChange('data_da_Coleta', value)}
              disabled={!editMode}
              iconStart={<Calendar size={18} />}
            />

            {/* Técnico Responsável */}
            <CustomInput
              type="text"
              label="Técnico Responsável"
              value={editMode ? formData.tecnico_Responsavel || '' : amostra.tecnico_Responsavel || ''}
              onChange={value => handleInputChange('tecnico_Responsavel', value)}
              disabled={!editMode}
              iconStart={<User size={18} />}
            />

            {/* Código Supervisor */}
            <CustomInput
              type="text"
              label="Código Supervisor"
              value={editMode ? formData.c_digo_Supervisor || '' : amostra.c_digo_Supervisor || ''}
              onChange={value => handleInputChange('c_digo_Supervisor', value)}
              disabled={!editMode}
              iconStart={<User size={18} />}
            />
          </div>
        </div>

        {/* Dados da Coleta */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Dados da Coleta
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profundidade */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Profundidade da Coleta</span>
              {editMode ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Layers size={18} className="text-gray-400" />
                  </span>
                  <select
                    value={formData.profundidade_da_Coleta || ''}
                    onChange={e => handleInputChange('profundidade_da_Coleta', e.target.value)}
                    className="block w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Selecione</option>
                    {profundidadeOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  <Layers size={14} className="text-gray-400" />
                  <span className="text-gray-900">{getLabel(amostra.profundidade_da_Coleta, profundidadeOptions)}</span>
                </div>
              )}
            </label>

            {/* Método de Coleta */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Método de Coleta</span>
              {editMode ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <TestTube size={18} className="text-gray-400" />
                  </span>
                  <select
                    value={formData.m_todo_de_Coleta || ''}
                    onChange={e => handleInputChange('m_todo_de_Coleta', e.target.value)}
                    className="block w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Selecione</option>
                    {metodoColetaOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  <TestTube size={14} className="text-gray-400" />
                  <span className="text-gray-900">{getLabel(amostra.m_todo_de_Coleta, metodoColetaOptions)}</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Características do Solo */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            Características do Solo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Solo */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Tipo de Solo</span>
              {editMode ? (
                <select
                  value={formData.tipo_de_Solo || ''}
                  onChange={e => handleInputChange('tipo_de_Solo', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Selecione</option>
                  {tipoSoloOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs inline-block w-fit">
                  {getLabel(amostra.tipo_de_Solo, tipoSoloOptions)}
                </span>
              )}
            </label>

            {/* Cor do Solo */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Cor do Solo</span>
              {editMode ? (
                <select
                  value={formData.cor_do_Solo || ''}
                  onChange={e => handleInputChange('cor_do_Solo', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Selecione</option>
                  {corSoloOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs inline-block w-fit">
                  {getLabel(amostra.cor_do_Solo, corSoloOptions)}
                </span>
              )}
            </label>

            {/* Textura */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Textura</span>
              {editMode ? (
                <select
                  value={formData.textura || ''}
                  onChange={e => handleInputChange('textura', e.target.value)}
                  className="block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                >
                  <option value="">Selecione</option>
                  {texturaOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              ) : (
                <span className="text-gray-900">{getLabel(amostra.textura, texturaOptions)}</span>
              )}
            </label>

            {/* Drenagem */}
            <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
              <span>Drenagem</span>
              {editMode ? (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Droplets size={18} className="text-gray-400" />
                  </span>
                  <select
                    value={formData.drenagem || ''}
                    onChange={e => handleInputChange('drenagem', e.target.value)}
                    className="block w-full pl-10 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Selecione</option>
                    {drenagemOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1">
                  <Droplets size={14} className="text-gray-400" />
                  <span className="text-gray-900">{getLabel(amostra.drenagem, drenagemOptions)}</span>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Culturas */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Culturas
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {/* Culturas Atuais */}
            <label className="text-sm font-medium text-gray-700">
              Culturas Atuais
              {editMode ? (
                <CustomInput
                  type="multiselect"
                  value={formData.cultura_Actual || []}
                  options={culturasOptions}
                  onChange={value => handleInputChange('cultura_Actual', value)}
                  helperText="Selecione uma ou mais culturas"
                />
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {getSelectedLabels(amostra.cultura_Actual, culturasOptions).map((label, idx) => (
                    <span key={`cultura-${idx}`} className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
                      <Leaf size={14} />
                      {label}
                    </span>
                  ))}
                </div>
              )}
            </label>

            {/* Cultura Anterior */}
            <CustomInput
              type="text"
              label="Cultura Anterior"
              value={editMode ? formData.cultura_Anterior || '' : amostra.cultura_Anterior || ''}
              onChange={value => handleInputChange('cultura_Anterior', value)}
              disabled={!editMode}
              iconStart={<Leaf size={18} />}
            />
          </div>
        </div>

        {/* Observações e Arquivo */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Observações e Anexos
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {/* Observações */}
            <CustomInput
              type="textarea"
              label="Observações Gerais"
              value={editMode ? formData.observa_es_Gerais || '' : amostra.observa_es_Gerais || ''}
              onChange={value => handleInputChange('observa_es_Gerais', value)}
              disabled={!editMode}
              rows={4}
            />

            {/* Arquivo */}
            {amostra.upload_da_Fotografia_da_Amostra && (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span className="flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Fotografia da Amostra
                </span>
                <div className="mt-2 px-3 py-2 bg-cyan-50 border border-cyan-200 rounded-lg text-sm text-cyan-700 flex items-center gap-2">
                  <Camera size={16} />
                  {amostra.upload_da_Fotografia_da_Amostra}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Modal de Confirmação de Cancelamento */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Cancelamento</h3>
              <p className="text-gray-600 text-center text-sm mb-4">
                Tem certeza que deseja cancelar? <br/>Os dados não salvos serão perdidos.
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

export default VisualizarAmostra;