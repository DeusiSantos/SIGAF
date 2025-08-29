import React, { useState, useCallback, useEffect } from "react";
import { Building, MapPin, Save, X, AlertCircle, CheckSquare, RotateCcw } from "lucide-react";
import { useAdministracoes } from "../hooks/useScoutData";
import api from "../services/api";
import CustomInput from "../components/CustomInput";

const CriarNucleo = () => {
  // Estados - removidos os campos número e código
  const [formData, setFormData] = useState({
    nome: "",
    id_regiao: "",
    numero: 0,
    codigo: ""
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  // Dados de Administrações Regionais
  const { administracoes, loading: loadingAdministracoes } = useAdministracoes();

  // Opções para o select de administrações
  const administracoesOptions = administracoes.map((adm) => ({
    label: adm.nome,
    value: Number(adm.id)
  }));

  // Validação do formulário - usando useCallback para melhor performance
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Validação do nome
    if (!formData.nome?.trim()) {
      newErrors.nome = "O nome é obrigatório.";
    }
    
    // Validação da administração regional
    if (!formData.id_regiao) {
      newErrors.id_regiao = "A administração regional é obrigatória.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handler para mostrar toast com auto-dismiss
  const showToast = useCallback((type, title, message, duration = 5000) => {
    // Limpa qualquer timeout existente
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }
    
    // Define a mensagem do toast
    setToastMessage({ type, title, message });
    
    // Configura timeout para auto-dismiss
    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, duration);
    
    setToastTimeout(timeout);
  }, [toastTimeout]);

  // Handler para alterar valores do formulário
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Limpa o erro do campo que foi alterado
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Reset do formulário
  const resetForm = useCallback(() => {
    setFormData({ 
      nome: "", 
      id_regiao: ""
    });
    setSubmitted(false);
    setErrors({});
  }, []);

  // Envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      showToast("error", "Erro no Formulário", "Verifique os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      // Prepara o payload apenas com os campos necessários
      const payload = {
        nome: formData.nome.trim(),
        adminRegionalId: Number(formData.id_regiao.value),
        numero: formData.numero,
        codigo: formData.codigo
      };

      console.log("Enviando payload:", payload);
      await api.post("/nucleo", payload);

      showToast("success", "Sucesso", "Núcleo cadastrado com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao cadastrar núcleo:", error);
      
      // Mensagem de erro personalizada baseada na resposta da API, se disponível
      const errorMessage = error.response?.data?.message || "Erro ao cadastrar núcleo.";
      showToast("error", "Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpar o timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [toastTimeout]);

  return (
    <div className="bg-white rounded-xl w-full ">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 animate-fade-in 
          ${toastMessage.type === "success" ? "bg-green-50 border-l-4 border-green-500 text-green-700" :
            toastMessage.type === "error" ? "bg-blue-50 border-l-4 border-blue-500 text-red-700" :
            "bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700"}`}
        >
          <div className="flex items-center">
            {toastMessage.type === "success" ? <CheckSquare className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
            <div>
              <h3 className="font-medium">{toastMessage.title}</h3>
              <p className="text-sm mt-1">{toastMessage.message}</p>
            </div>
            <button 
              className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => setToastMessage(null)}
              aria-label="Fechar notificação"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Título */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cadastro de Núcleo</h1>
        <p className="text-gray-600">Preencha todos os campos obrigatórios</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput
            type="text"
            label="Nome do Núcleo"
            value={formData.nome}
            onChange={(value) => handleInputChange("nome", value)}
            required
            iconStart={<Building size={18} className="text-gray-500" />}
            errorMessage={submitted && errors.nome}
            disabled={loading}
            id="nome"
            placeholder="Digite o nome do núcleo"
          />

          <CustomInput
            type="select"
            label="Administração Regional"
            value={formData.id_regiao}
            onChange={(value) => handleInputChange("id_regiao", value)}
            options={administracoesOptions}
            required
            iconStart={<MapPin size={18} className="text-gray-500" />}
            errorMessage={submitted && errors.id_regiao}
            disabled={loading || loadingAdministracoes}
            id="id_regiao"
            helperText={loadingAdministracoes ? "Carregando administrações..." : ""}
            placeholder="Selecione uma administração"
          />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">
            O número e o código do núcleo serão gerados automaticamente pela base de dados.
          </p>
        </div>

        {/* Botões */}
        <div className="mt-4 flex flex-wrap gap-4 items-center justify-end">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800 flex items-center"
            disabled={loading}
          >
            <RotateCcw size={18} className="w-4 h-4 mr-2" />
            Limpar
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Save size={18} className="w-5 h-5 mr-2" />
                Cadastrar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarNucleo;