import axios from 'axios';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Camera,
  Droplets,
  Edit,
  FileText,
  Layers,
  Leaf,
  MapPin,
  Save,
  TestTube,
  User,
  X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';

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

  // Estados para imagem
  const [imagemUrl, setImagemUrl] = useState('');
  const [loadingFoto, setLoadingFoto] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [novaFoto, setNovaFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState('');

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

  const getLabel = (value, options) => {
    const option = options.find(opt => opt.value === value);
    return option ? option.label : value || 'N/A';
  };

  const getSelectedLabels = (selected, options) => {
    if (!selected || !Array.isArray(selected)) return [];
    return options.filter(opt => selected.includes(opt.value)).map(opt => opt.label);
  };

  // Carregar dados da amostra
  useEffect(() => {
    const fetchAmostra = async () => {
      try {
        console.log('🔄 Carregando amostra:', id);

        const response = await axios.get(
          `https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/${id}`
        );

        const data = response.data;
        console.log('📊 Dados da amostra:', data);

        setAmostra(data);
        setFormData(data);
      } catch (error) {
        setErro('Erro ao carregar amostra de solo.');
        console.error('❌ Erro ao carregar amostra:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAmostra();
  }, [id]);

  // Carregar imagem
  useEffect(() => {
    const carregarImagem = async () => {
      if (!id) return;

      setLoadingFoto(true);
      try {
        console.log('🔍 Buscando foto da amostra:', id);

        const response = await axios.get(
          `https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/${id}/fotografiaDeAmostra`,
          {
            responseType: 'blob',
            timeout: 60000
          }
        );

        console.log('📦 Resposta recebida:', {
          status: response.status,
          contentType: response.headers['content-type'],
          size: response.data.size
        });

        if (response.data && response.data.size > 0) {
          const contentType = response.headers['content-type'];
          if (contentType && contentType.startsWith('image/')) {
            const url = URL.createObjectURL(response.data);
            console.log('✅ URL da foto criada:', url);
            setImagemUrl(url);
          } else {
            console.warn('⚠️ Resposta não é uma imagem:', contentType);
            setImagemUrl('');
          }
        } else {
          console.log('ℹ️ Sem foto disponível');
          setImagemUrl('');
        }
      } catch (error) {
        console.error('❌ Erro ao carregar foto:', error);
        setImagemUrl('');
      } finally {
        setLoadingFoto(false);
      }
    };

    carregarImagem();
  }, [id]);

  // Cleanup da URL do blob quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (imagemUrl && imagemUrl.startsWith('blob:')) {
        console.log('🧹 Limpando URL do blob:', imagemUrl);
        URL.revokeObjectURL(imagemUrl);
      }
      if (previewFoto && previewFoto.startsWith('blob:')) {
        URL.revokeObjectURL(previewFoto);
      }
    };
  }, [imagemUrl, previewFoto]);

  const handleInputChange = (field, value) => {
    let formattedValue = value;

    if (field === 'c_digo_do_') {
      formattedValue = value === '' ? 0 : parseInt(value, 10);
    } else if (field === 'cultura_Actual') {
      formattedValue = Array.isArray(value) ? value : [value];
    }

    setFormData(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Handler para mudança de arquivo
  const handleFotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('📁 Nova foto selecionada:', file.name, file.type, file.size);
      setNovaFoto(file);

      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => setPreviewFoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Função para fazer upload da foto
  const uploadFoto = async (file) => {
    if (!file) {
      showToast('error', 'Selecione uma foto primeiro');
      return;
    }

    setUploadingFoto(true);
    try {
      const formData = new FormData();
      formData.append('novaImagem', file);

      const response = await axios.patch(
        `https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/${id}/fotografiaDeAmostra`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        showToast('success', 'Foto atualizada com sucesso!');
        const url = URL.createObjectURL(file);
        setImagemUrl(url);
        setNovaFoto(null);
        setPreviewFoto('');
      }
    } catch (error) {
      console.error('Erro ao fazer upload da foto:', error);
      showToast('error', 'Erro ao atualizar foto');
    } finally {
      setUploadingFoto(false);
    }
  };

  // Função para cancelar upload
  const cancelarFoto = () => {
    setNovaFoto(null);
    setPreviewFoto('');
  };

  const showToast = (severity, summary, detail, duration = 4000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      const payload = {
        id: parseInt(id),
        este_solo_pertence_a_um_produt: typeof formData.este_solo_pertence_a_um_produt === 'object' ? formData.este_solo_pertence_a_um_produt?.value || "" : formData.este_solo_pertence_a_um_produt || "",
        c_digo_do_: formData.c_digo_do_ || 0,
        profundidade_da_Coleta: typeof formData.profundidade_da_Coleta === 'object' ? formData.profundidade_da_Coleta?.value || "" : formData.profundidade_da_Coleta || "",
        m_todo_de_Coleta: typeof formData.m_todo_de_Coleta === 'object' ? formData.m_todo_de_Coleta?.value || "" : formData.m_todo_de_Coleta || "",
        cultura_Actual: Array.isArray(formData.cultura_Actual)
          ? formData.cultura_Actual.map(item => typeof item === 'object' ? item.value : item)
          : [],
        cultura_Anterior: Array.isArray(formData.cultura_Anterior)
          ? formData.cultura_Anterior.map(item => typeof item === 'object' ? item.value : item)
          : [formData.cultura_Anterior || ""],
        tipo_de_Solo: typeof formData.tipo_de_Solo === 'object' ? formData.tipo_de_Solo?.value || "" : formData.tipo_de_Solo || "",
        cor_do_Solo: typeof formData.cor_do_Solo === 'object' ? formData.cor_do_Solo?.value || "" : formData.cor_do_Solo || "",
        textura: typeof formData.textura === 'object' ? formData.textura?.value || "" : formData.textura || "",
        drenagem: typeof formData.drenagem === 'object' ? formData.drenagem?.value || "" : formData.drenagem || "",
        upload_da_Fotografia_da_Amostra: formData.upload_da_Fotografia_da_Amostra || "",
        observa_es_Gerais: formData.observa_es_Gerais || "",
        tecnico_Responsavel: formData.tecnico_Responsavel || "",
        c_digo_Supervisor: formData.c_digo_Supervisor || "",
        data_da_Coleta: formData.data_da_Coleta || new Date().toISOString().split('T')[0]
      };

      console.log('📤 Payload enviado:', payload);

      const response = await fetch(
        `https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        let errorMessage = 'Erro ao salvar';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage = `Erro ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      let updatedData;
      try {
        updatedData = await response.json();
      } catch {
        // Se não conseguir fazer parse do JSON, usar os dados do formData
        updatedData = { ...formData, id: parseInt(id) };
      }
      setAmostra(updatedData);
      setFormData(updatedData);
      setEditMode(false);
      setNovaFoto(null);
      setPreviewFoto('');

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
    setNovaFoto(null);
    setPreviewFoto('');
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
              <div className="flex-col">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <TestTube className="w-6 h-6 text-emerald-600" />
                  Detalhes da Amostra de Solo
                </h1>
                <span className="text-gray-600">ID da Amostra: <span className="font-semibold">#{amostra.id || amostra._id}</span></span>
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
            {editMode ? (
              <CustomInput
                type="select"
                label="Pertence a um Produtor?"
                value={formData.este_solo_pertence_a_um_produt || ''}
                onChange={value => handleInputChange('este_solo_pertence_a_um_produt', value)}
                options={pertenceProdutorOptions}
                iconStart={<User size={18} />}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Pertence a um Produtor?</span>
                <div className="mt-1 flex items-center gap-1">
                  <User size={14} className="text-gray-400" />
                  <span className={`px-2 py-0.5 rounded text-xs ${amostra.este_solo_pertence_a_um_produt === 'sim'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                    }`}>
                    {getLabel(amostra.este_solo_pertence_a_um_produt, pertenceProdutorOptions)}
                  </span>
                </div>
              </label>
            )}

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
            {editMode ? (
              <CustomInput
                type="select"
                label="Profundidade da Coleta"
                value={formData.profundidade_da_Coleta || ''}
                onChange={value => handleInputChange('profundidade_da_Coleta', value)}
                options={profundidadeOptions}
                iconStart={<Layers size={18} />}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Profundidade da Coleta</span>
                <div className="mt-1 flex items-center gap-1">
                  <Layers size={14} className="text-gray-400" />
                  <span className="text-gray-900">{getLabel(amostra.profundidade_da_Coleta, profundidadeOptions)}</span>
                </div>
              </label>
            )}

            {/* Método de Coleta */}
            {editMode ? (
              <CustomInput
                type="select"
                label="Método de Coleta"
                value={formData.m_todo_de_Coleta || ''}
                onChange={value => handleInputChange('m_todo_de_Coleta', value)}
                options={metodoColetaOptions}
                iconStart={<TestTube size={18} />}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Método de Coleta</span>
                <div className="mt-1 flex items-center gap-1">
                  <TestTube size={14} className="text-gray-400" />
                  <span className="text-gray-900">{getLabel(amostra.m_todo_de_Coleta, metodoColetaOptions)}</span>
                </div>
              </label>
            )}
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
            {editMode ? (
              <CustomInput
                type="select"
                label="Tipo de Solo"
                value={formData.tipo_de_Solo || ''}
                onChange={value => handleInputChange('tipo_de_Solo', value)}
                options={tipoSoloOptions}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Tipo de Solo</span>
                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs inline-block w-fit">
                  {getLabel(amostra.tipo_de_Solo, tipoSoloOptions)}
                </span>
              </label>
            )}

            {/* Cor do Solo */}
            {editMode ? (
              <CustomInput
                type="select"
                label="Cor do Solo"
                value={formData.cor_do_Solo || ''}
                onChange={value => handleInputChange('cor_do_Solo', value)}
                options={corSoloOptions}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Cor do Solo</span>
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs inline-block w-fit">
                  {getLabel(amostra.cor_do_Solo, corSoloOptions)}
                </span>
              </label>
            )}

            {/* Textura */}
            {editMode ? (
              <CustomInput
                type="select"
                label="Textura"
                value={formData.textura || ''}
                onChange={value => handleInputChange('textura', value)}
                options={texturaOptions}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Textura</span>
                <span className="text-gray-900">{getLabel(amostra.textura, texturaOptions)}</span>
              </label>
            )}

            {/* Drenagem */}
            {editMode ? (
              <CustomInput
                type="select"
                label="Drenagem"
                value={formData.drenagem || ''}
                onChange={value => handleInputChange('drenagem', value)}
                options={drenagemOptions}
                iconStart={<Droplets size={18} />}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700 flex flex-col gap-1">
                <span>Drenagem</span>
                <div className="mt-1 flex items-center gap-1">
                  <Droplets size={14} className="text-gray-400" />
                  <span className="text-gray-900">{getLabel(amostra.drenagem, drenagemOptions)}</span>
                </div>
              </label>
            )}
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
            {editMode ? (
              <CustomInput
                type="multiselect"
                label="Culturas Atuais"
                value={formData.cultura_Actual || []}
                options={culturasOptions}
                onChange={value => handleInputChange('cultura_Actual', value)}
                helperText="Selecione uma ou mais culturas"
              />
            ) : (
              <label className="text-sm font-medium text-gray-700">
                Culturas Atuais
                <div className="flex flex-wrap gap-2 mt-2">
                  {(() => {
                    let culturasAtuais = amostra.cultura_Actual;
                    if (typeof culturasAtuais === 'string') {
                      try {
                        culturasAtuais = JSON.parse(culturasAtuais);
                      } catch {
                        return <span className="text-gray-600">{culturasAtuais}</span>;
                      }
                    }

                    if (Array.isArray(culturasAtuais)) {
                      return culturasAtuais.map((item, idx) => {
                        const nome =
                          typeof item === 'object'
                            ? item.value || item.label
                            : item;
                        return (
                          <span
                            key={`cultura-${idx}`}
                            className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1"
                          >
                            <Leaf size={14} />
                            {nome}
                          </span>
                        );
                      });
                    }
                    return <span className="text-gray-600">N/A</span>;
                  })()}
                </div>
              </label>
            )}

            {/* Cultura Anterior */}
            {editMode ? (
              <CustomInput
                type="text"
                label="Cultura Anterior"
                value={formData.cultura_Anterior || ''}
                onChange={value => handleInputChange('cultura_Anterior', value)}
                iconStart={<Leaf size={18} />}
              />
            ) : (
              <label className="text-sm font-medium text-gray-700">
                Cultura Anterior
                <div className="flex flex-wrap gap-2 mt-2">
                  {(() => {
                    let culturaAnterior = amostra.cultura_Anterior;
                    if (typeof culturaAnterior === 'string') {
                      try {
                        culturaAnterior = JSON.parse(culturaAnterior);
                      } catch {
                        return <span className="text-gray-600">{culturaAnterior}</span>;
                      }
                    }

                    if (Array.isArray(culturaAnterior)) {
                      return culturaAnterior.map((item, idx) => {
                        const nome =
                          typeof item === 'object'
                            ? item.value || item.label
                            : item;
                        return (
                          <span
                            key={`cultura-ant-${idx}`}
                            className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs flex items-center gap-1"
                          >
                            <Leaf size={14} />
                            {nome}
                          </span>
                        );
                      });
                    }
                    return <span className="text-gray-600">{culturaAnterior || 'N/A'}</span>;
                  })()}
                </div>
              </label>
            )}
          </div>
        </div>

        {/* Fotografia da Amostra */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-purple-600" />
            Fotografia da Amostra
          </h2>

          <div className="bg-gray-50 rounded-lg p-4">
            {loadingFoto && (
              <div className="flex items-center justify-center p-8 text-gray-500">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                <span className="ml-3">Carregando foto...</span>
              </div>
            )}

            {!loadingFoto && (imagemUrl || previewFoto) && (
              <img
                src={previewFoto || imagemUrl}
                alt="Fotografia da Amostra"
                className="w-full h-auto rounded-lg max-h-96 object-cover"
                onError={(e) => {
                  console.error('❌ Erro ao carregar imagem:', e);
                  setImagemUrl('');
                }}
              />
            )}

            {!loadingFoto && !imagemUrl && !previewFoto && (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhuma fotografia disponível</p>
                </div>
              </div>
            )}

            {editMode && (
              <div className="mt-4">
                <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                  />
                  {imagemUrl || previewFoto ? 'Alterar Foto' : 'Adicionar Foto'}
                </label>

                {novaFoto && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => uploadFoto(novaFoto)}
                      disabled={uploadingFoto}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:bg-green-300"
                    >
                      {uploadingFoto ? 'Enviando...' : 'Confirmar Upload'}
                    </button>
                    <button
                      onClick={cancelarFoto}
                      disabled={uploadingFoto}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Observações */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            Observações
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <CustomInput
              type="textarea"
              label="Observações Gerais"
              value={editMode ? formData.observa_es_Gerais || '' : amostra.observa_es_Gerais || ''}
              onChange={value => handleInputChange('observa_es_Gerais', value)}
              disabled={!editMode}
              rows={4}
            />
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

export default VisualizarAmostra;