import React, { useState } from 'react';
import { FileText, Save, X, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import CustomInput from '../../components/CustomInput';

const CadastroLicencas = () => {
  const [formData, setFormData] = useState({
    tipoLicenca: '',
    areaAssociada: '',
    documentoUpload: null,
    validadePretendida: '',
    autorizacaoFinal: ''
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Licença cadastrada:', formData);
      showToast('success', 'Sucesso', 'Licença cadastrada com sucesso!');
      
      // Reset form
      setFormData({
        tipoLicenca: '',
        areaAssociada: '',
        documentoUpload: null,
        validadePretendida: '',
        autorizacaoFinal: ''
      });
    } catch (error) {
      console.error('Erro ao cadastrar licença:', error);
      showToast('error', 'Erro', 'Erro ao cadastrar licença. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Componente Toast
  const Toast = () => {
    if (!toastMessage) return null;

    const { severity, summary, detail } = toastMessage;

    let bgColor, icon;
    switch (severity) {
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
      <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor} animate-fadeIn`}>
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <div>
            <h3 className="font-medium">{summary}</h3>
            <p className="text-sm mt-1">{detail}</p>
          </div>
          <button
            className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => setToastMessage(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Toast />
      
      {/* Header */}
      <div className="text-center mb-6 p-10 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Licença Florestal</h1>
        <p className="text-gray-600">Preencha os dados para solicitar uma nova licença florestal</p>
      </div>

      {/* Content */}
      <div className=" mx-auto p-8">
        <div className="bg-white rounded-2xl  p-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Dados da Licença</h3>
            </div>
            <p className="text-gray-600">
              Informe os dados necessários para a solicitação da licença florestal.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tipo de licença solicitada */}
              <CustomInput
                type="select"
                label="Tipo de licença solicitada"
                value={formData.tipoLicenca}
                options={[
                  { label: "Corte", value: "Corte" },
                  { label: "Transporte", value: "Transporte" },
                  { label: "Carvão", value: "Carvão" },
                  { label: "PFNM - Produtos Florestais Não Madeiros", value: "PFNM" }
                ]}
                onChange={(value) => handleInputChange('tipoLicenca', value)}
                required
                iconStart={<FileText size={18} />}
                placeholder="Selecione o tipo de licença"
              />

              {/* Área associada */}
              <CustomInput
                type="select"
                label="Área associada"
                value={formData.areaAssociada}
                options={[
                  { label: "Área Florestal Principal", value: "area_principal" },
                  { label: "Área Secundária Norte", value: "area_secundaria_norte" },
                  { label: "Área Secundária Sul", value: "area_secundaria_sul" },
                  { label: "Área de Reflorestamento", value: "area_reflorestamento" }
                ]}
                onChange={(value) => handleInputChange('areaAssociada', value)}
                required
                placeholder="Selecione a área florestal"
              />

              {/* Validade pretendida */}
              <CustomInput
                type="date"
                label="Validade pretendida"
                value={formData.validadePretendida}
                onChange={(value) => handleInputChange('validadePretendida', value)}
                required
                helperText="Data até quando a licença deve ser válida"
              />

              {/* Autorização final */}
              <CustomInput
                type="select"
                label="Autorização final"
                value={formData.autorizacaoFinal}
                options={[
                  { label: "Aprovado", value: "Aprovado" },
                  { label: "Negado", value: "Negado" }
                ]}
                onChange={(value) => handleInputChange('autorizacaoFinal', value)}
                required
                placeholder="Status da autorização"
              />
            </div>

            {/* Upload de documentos */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Upload de documentos
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleInputChange('documentoUpload', e.target.files[0])}
                  id="documento-upload"
                  required
                />
                <label
                  htmlFor="documento-upload"
                  className={`flex flex-col items-center justify-center h-48 px-6 py-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.documentoUpload
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  <Upload className={`w-12 h-12 mb-4 ${formData.documentoUpload ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className={`text-lg font-medium mb-2 ${formData.documentoUpload ? 'text-blue-600' : 'text-gray-500'}`}>
                    {formData.documentoUpload ? 'Documento carregado' : 'Carregar documentos'}
                  </p>
                  {formData.documentoUpload ? (
                    <p className="text-sm text-blue-500">{formData.documentoUpload.name}</p>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">
                      Clique para selecionar ou arraste os arquivos aqui
                    </p>
                  )}
                </label>
              </div>
              <div className="text-xs text-gray-500">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (Máx. 10MB)
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                onClick={() => {
                  setFormData({
                    tipoLicenca: '',
                    areaAssociada: '',
                    documentoUpload: null,
                    validadePretendida: '',
                    autorizacaoFinal: ''
                  });
                }}
              >
                <X className="w-4 h-4 mr-2 inline" />
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  saving
                    ? 'bg-blue-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2 inline" />
                    Salvar Licença
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

export default CadastroLicencas;