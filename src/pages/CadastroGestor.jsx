import React, { useState, useCallback, useEffect } from "react";
import { User, Mail, Lock, UserPlus, Building, MapPin, Save, X, AlertCircle, CheckSquare, RotateCcw, Users, Globe } from "lucide-react";
import { useAdministracoes, useNucleo, useGroupings } from "../hooks/useScoutData";
import api from "../services/api";
import CustomInput from "../components/CustomInput";

const CadastroGestor = () => {
  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    tipoDeGestor: null, // Usará os valores do enum UserRolesStatus
    estado: "Ativo", // ManagerStatus Enum: Ativo ou Inativo
    dataDeRegistro: new Date().toISOString().split('T')[0],
    adminNacionalId: 1, // Valor fixo conforme especificado
    adminRegionalId: null,
    nucleoId: null,
    agrupamentoId: null
  });

  // Estados para seleção dependente (para núcleo e agrupamento)
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filteredNucleos, setFilteredNucleos] = useState([]);
  const [filteredAgrupamentos, setFilteredAgrupamentos] = useState([]);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  // Hooks para obter dados
  const { administracoes, loading: loadingAdministracoes } = useAdministracoes();
  const { nucleo: nucleos, loading: loadingNucleos } = useNucleo();
  const { groupings: agrupamentos, loading: loadingAgrupamentos } = useGroupings();

  // Opções para o select de tipo de gestor - Usando valores do enum UserRolesStatus
  const tiposGestor = [
    { label: "Nacional", value: "Nacional" },
    { label: "Regional", value: "Regional" },
    { label: "Núcleo", value: "Nucleo" },
    { label: "Agrupamento", value: "Agrupamento" }
  ];

  // Opções para o select de administrações
  const administracoesOptions = administracoes?.map((adm) => ({
    label: adm.nome,
    value: adm.id
  })) || [];

  // Filtra núcleos baseado na região selecionada
  useEffect(() => {
    if (selectedRegion && nucleos?.length > 0) {
      const filtered = nucleos.filter(nucleo => 
        nucleo.adminRegionalId === selectedRegion
      );
      
      setFilteredNucleos(filtered.map(nucleo => ({
        label: nucleo.nome,
        value: nucleo.id
      })));
    } else {
      setFilteredNucleos([]);
    }
  }, [selectedRegion, nucleos]);

  // Filtra agrupamentos baseado na região selecionada
  useEffect(() => {
    if (selectedRegion && agrupamentos?.length > 0) {
      const filtered = agrupamentos.filter(agrupamento => 
        agrupamento.adminRegionalId === selectedRegion
      );
      
      setFilteredAgrupamentos(filtered.map(agrupamento => ({
        label: agrupamento.nome,
        value: agrupamento.id
      })));
    } else {
      setFilteredAgrupamentos([]);
    }
  }, [selectedRegion, agrupamentos]);

  // Validação do formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    // Validações básicas
    if (!formData.nome?.trim()) {
      newErrors.nome = "O nome é obrigatório.";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "O email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido.";
    }
    
    if (!formData.senha?.trim()) {
      newErrors.senha = "A senha é obrigatória.";
    } else if (formData.senha.length < 6) {
      newErrors.senha = "A senha deve ter pelo menos 6 caracteres.";
    }
    
    if (!formData.tipoDeGestor) {
      newErrors.tipoDeGestor = "O tipo de gestor é obrigatório.";
    }
    
    // Validações específicas por tipo de gestor
    if (formData.tipoDeGestor === "Regional" && !formData.adminRegionalId) {
      newErrors.adminRegionalId = "A administração regional é obrigatória.";
    }
    
    if (formData.tipoDeGestor === "Nucleo" && !formData.adminRegionalId) {
      newErrors.adminRegionalId = "A administração regional é obrigatória.";
    }
    
    if (formData.tipoDeGestor === "Nucleo" && !formData.nucleoId) {
      newErrors.nucleoId = "O núcleo é obrigatório.";
    }
    
    if (formData.tipoDeGestor === "Agrupamento" && !formData.adminRegionalId) {
      newErrors.adminRegionalId = "A administração regional é obrigatória.";
    }
    
    if (formData.tipoDeGestor === "Agrupamento" && !formData.agrupamentoId) {
      newErrors.agrupamentoId = "O agrupamento é obrigatório.";
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
    // Para campos de select que usam objetos { label, value }
    const inputValue = value && typeof value === 'object' ? value.value : value;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      // Atualiza o campo
      newData[field] = inputValue;
      
      // Lógica especial para tipo de gestor
      if (field === 'tipoDeGestor') {
        // Limpar os campos relacionados
        newData.adminRegionalId = null;
        newData.nucleoId = null;
        newData.agrupamentoId = null;
        setSelectedRegion(null);
      }
      
      // Lógica para atualizar a região selecionada
      if (field === 'adminRegionalId') {
        setSelectedRegion(inputValue);
        // Resetar campos dependentes
        newData.nucleoId = null;
        newData.agrupamentoId = null;
      }
      
      return newData;
    });
    
    // Limpa o erro do campo que foi alterado
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  // Reset do formulário
  const resetForm = useCallback(() => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      tipoDeGestor: null,
      estado: "Ativo",
      dataDeRegistro: new Date().toISOString().split('T')[0],
      adminNacionalId: 1,
      adminRegionalId: null,
      nucleoId: null,
      agrupamentoId: null
    });
    setSelectedRegion(null);
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
      // Prepara o payload para a API
      const payload = {
        nome: formData.nome.trim(),
        email: formData.email.trim(),
        senha: formData.senha,
        tipoDeGestor: formData.tipoDeGestor,
        estado: formData.estado,
        dataDeRegistro: formData.dataDeRegistro,
        adminNacionalId: formData.adminNacionalId,
        adminRegionalId: formData.adminRegionalId || null,
        nucleoId: formData.nucleoId || null,
        agrupamentoId: formData.agrupamentoId || null
      };

      console.log("Enviando payload:", payload);
      await api.post("/gestor", payload);

      showToast("success", "Sucesso", "Gestor cadastrado com sucesso!");
      resetForm();
    } catch (error) {
      console.error("Erro ao cadastrar gestor:", error);
      
      // Mensagem de erro personalizada baseada na resposta da API, se disponível
      const errorMessage = error.response?.data?.message || "Erro ao cadastrar gestor.";
      showToast("error", "Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper para obter o valor formatado para os inputs
  const getFieldValue = useCallback((field) => {
    const value = formData[field];
    if (value === null || value === undefined) return null;
    
    // Para campos select, retornar o formato esperado pelo CustomInput
    switch (field) {
      case 'tipoDeGestor':
        return tiposGestor.find(item => item.value === value) || null;
      case 'adminRegionalId':
        return administracoesOptions.find(item => item.value === value) || null;
      case 'nucleoId':
        return filteredNucleos.find(item => item.value === value) || null;
      case 'agrupamentoId':
        return filteredAgrupamentos.find(item => item.value === value) || null;
      default:
        return value;
    }
  }, [formData, tiposGestor, administracoesOptions, filteredNucleos, filteredAgrupamentos]);

  // Limpar o timeout ao desmontar o componente
  useEffect(() => {
    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [toastTimeout]);

  return (
    <div className="bg-white rounded-xl ">
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Cadastro de Gestor</h1>
        <p className="text-gray-600">Preencha todos os campos obrigatórios</p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Informações Básicas */}
          <CustomInput
            type="text"
            label="Nome do Gestor"
            value={formData.nome}
            onChange={(value) => handleInputChange("nome", value)}
            required
            iconStart={<User size={18} className="text-gray-500" />}
            errorMessage={submitted && errors.nome}
            disabled={loading}
            id="nome"
            placeholder="Digite o nome do gestor"
          />

          <CustomInput
            type="email"
            label="Email"
            value={formData.email}
            onChange={(value) => handleInputChange("email", value)}
            required
            iconStart={<Mail size={18} className="text-gray-500" />}
            errorMessage={submitted && errors.email}
            disabled={loading}
            id="email"
            placeholder="Digite o email do gestor"
          />

          <CustomInput
            type="password"
            label="Senha"
            value={formData.senha}
            onChange={(value) => handleInputChange("senha", value)}
            required
            iconStart={<Lock size={18} className="text-gray-500" />}
            errorMessage={submitted && errors.senha}
            disabled={loading}
            id="senha"
            placeholder="Digite a senha"
          />

          <CustomInput
            type="select"
            label="Tipo de Gestor"
            value={getFieldValue("tipoDeGestor")}
            onChange={(value) => handleInputChange("tipoDeGestor", value)}
            options={tiposGestor}
            required
            iconStart={<UserPlus size={18} className="text-gray-500" />}
            errorMessage={submitted && errors.tipoDeGestor}
            disabled={loading}
            id="tipoDeGestor"
            placeholder="Selecione o tipo de gestor"
          />

          {/* Campos Específicos para Cada Tipo de Gestor */}
          {['Regional', 'Nucleo', 'Agrupamento'].includes(formData.tipoDeGestor) && (
            <div className={formData.tipoDeGestor === 'Regional' ? "md:col-span-2" : "md:col-span-1"}>
              <CustomInput
                type="select"
                label="Administração Regional"
                value={getFieldValue("adminRegionalId")}
                onChange={(value) => handleInputChange("adminRegionalId", value)}
                options={administracoesOptions}
                required
                iconStart={<Building size={18} className="text-gray-500" />}
                errorMessage={submitted && errors.adminRegionalId}
                disabled={loading || loadingAdministracoes}
                id="adminRegionalId"
                placeholder="Selecione a administração regional"
                helperText={loadingAdministracoes ? "Carregando administrações..." : ""}
              />
            </div>
          )}

          {formData.tipoDeGestor === 'Nucleo' && selectedRegion && (
            <div className="md:col-span-1">
              <CustomInput
                type="select"
                label="Núcleo"
                value={getFieldValue("nucleoId")}
                onChange={(value) => handleInputChange("nucleoId", value)}
                options={filteredNucleos}
                required
                iconStart={<Globe size={18} className="text-gray-500" />}
                errorMessage={submitted && errors.nucleoId}
                disabled={loading || loadingNucleos || !selectedRegion}
                id="nucleoId"
                placeholder={selectedRegion ? "Selecione o núcleo" : "Selecione primeiro a região"}
                helperText={loadingNucleos ? "Carregando núcleos..." : filteredNucleos.length === 0 && selectedRegion ? "Nenhum núcleo encontrado para esta região" : ""}
              />
            </div>
          )}

          {formData.tipoDeGestor === 'Agrupamento' && selectedRegion && (
            <div className="md:col-span-1">
              <CustomInput
                type="select"
                label="Agrupamento"
                value={getFieldValue("agrupamentoId")}
                onChange={(value) => handleInputChange("agrupamentoId", value)}
                options={filteredAgrupamentos}
                required
                iconStart={<Users size={18} className="text-gray-500" />}
                errorMessage={submitted && errors.agrupamentoId}
                disabled={loading || loadingAgrupamentos || !selectedRegion}
                id="agrupamentoId"
                placeholder={selectedRegion ? "Selecione o agrupamento" : "Selecione primeiro a região"}
                helperText={loadingAgrupamentos ? "Carregando agrupamentos..." : filteredAgrupamentos.length === 0 && selectedRegion ? "Nenhum agrupamento encontrado para esta região" : ""}
              />
            </div>
          )}
        </div>

        {/* Botões */}
        <div className="mt-8 flex flex-wrap gap-4 items-center justify-end border-t border-gray-200 pt-6">
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

export default CadastroGestor;