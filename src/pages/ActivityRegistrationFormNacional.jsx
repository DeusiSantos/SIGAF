import React, { useState, useCallback, useEffect } from 'react';
import { 
  Tag, MapPin, Phone, Mail, Globe, Users, Calendar, Facebook,
  AlignLeft, Building, Save, X, AlertCircle, CheckSquare, RotateCcw
} from 'lucide-react';
import api from '../services/api';
import CustomInput from '../components/CustomInput';
import { useAdministracoes } from '../hooks/useScoutData';

const ActivityRegistrationFormNacional = () => {
  // Estados
  const [formData, setFormData] = useState({
    nome: '',
    localizacao: '',
    telefone: '',
    telefone_opcional: '',
    email: '',
    website: '',
    redes_sociais: '',
    numero_participantes: 0,
    data_inicio: '',
    data_termino: '',
    descricao: '',
    adm_nacional_id: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  
  // Obtendo dados de administrações através do hook
  const { administracoes, loading: loadingAdministracoes } = useAdministracoes();

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

  // Função para validar o formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = ['nome', 'localizacao', 'telefone', 'email', 'numero_participantes', 'descricao', 'data_inicio', 'data_termino'];
    
    requiredFields.forEach(field => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = `O campo ${field.replace(/_/g, ' ')} é obrigatório.`;
      }
    });
    
    // Validação específica para email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido. Por favor, informe um email válido.';
    }
    
    // Validação específica para telefone
    if (formData.telefone && !/^\d{9}$/.test(formData.telefone.replace(/\D/g, ''))) {
      newErrors.telefone = 'Telefone inválido. O número deve ter 9 dígitos.';
    }
    
    // Validação opcional para telefone adicional
    if (formData.telefone_opcional && !/^\d{9}$/.test(formData.telefone_opcional.replace(/\D/g, ''))) {
      newErrors.telefone_opcional = 'Telefone inválido. O número deve ter 9 dígitos.';
    }
    
    // Validação para datas
    if (formData.data_inicio && formData.data_termino) {
      const inicio = new Date(formData.data_inicio);
      const termino = new Date(formData.data_termino);
      
      if (inicio > termino) {
        newErrors.data_termino = 'A data de término deve ser posterior à data de início.';
      }
    }
    
    // Validação para número de participantes
    if (formData.numero_participantes <= 0) {
      newErrors.numero_participantes = 'O número de participantes deve ser maior que zero.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Função para lidar com mudança nos campos
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro se o campo foi preenchido
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  // Função para resetar o formulário
  const resetForm = useCallback(() => {
    setFormData({
      nome: '',
      localizacao: '',
      telefone: '',
      telefone_opcional: '',
      email: '',
      website: '',
      redes_sociais: '',
      numero_participantes: 0,
      data_inicio: '',
      data_termino: '',
      descricao: '',
      adm_nacional_id: 1
    });
    setSubmitted(false);
    setErrors({});
  }, []);

  // Função para enviar o formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    if (!validateForm()) {
      showToast('error', 'Formulário Incompleto', 'Verifique os campos destacados em vermelho.');
      return;
    }
    
    setLoading(true);
    try {
      // Formatar datas para o formato esperado pela API
      const formattedData = {
        ...formData,
        numero_participantes: Number(formData.numero_participantes),
        data_inicio: formData.data_inicio instanceof Date 
          ? formData.data_inicio.toISOString().split('T')[0]
          : formData.data_inicio,
        data_termino: formData.data_termino instanceof Date 
          ? formData.data_termino.toISOString().split('T')[0]
          : formData.data_termino
      };
      
      await api.post('/atividadesNacionais', formattedData);
      
      showToast('success', 'Sucesso', 'Atividade cadastrada com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar atividade:', error);
      
      // Mensagem de erro personalizada baseada na resposta da API, se disponível
      const errorMessage = error.response?.data?.message || "Erro ao cadastrar atividade.";
      showToast('error', 'Erro', errorMessage);
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
    <div className="bg-white rounded-xl shadow-lg w-full">
      {/* Toast para notificações */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 animate-fade-in
          ${toastMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 
            toastMessage.type === 'error' ? 'bg-blue-50 border-l-4 border-blue-500 text-red-700' : 
            'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700'}`}
        >
          <div className="flex items-center">
            {toastMessage.type === 'success' ? (
              <CheckSquare className="w-5 h-5 mr-3" />
            ) : toastMessage.type === 'error' ? (
              <AlertCircle className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
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
      
      <div className="p-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Criar Atividade Nacional</h1>
          <p className="text-gray-600">Preencha todos os campos obrigatórios</p>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nome da Atividade */}
            <CustomInput
              type="text"
              label="Nome da Atividade"
              value={formData.nome}
              onChange={(value) => handleInputChange('nome', value)}
              required
              iconStart={<Tag className="text-gray-500" />}
              errorMessage={submitted && errors.nome}
              disabled={loading}
              id="nome"
              placeholder="Digite o nome da atividade"
            />
            
            {/* Localização */}
            <CustomInput
              type="text"
              label="Localização"
              value={formData.localizacao}
              onChange={(value) => handleInputChange('localizacao', value)}
              required
              iconStart={<MapPin className="text-gray-500" />}
              errorMessage={submitted && errors.localizacao}
              disabled={loading}
              id="localizacao"
              placeholder="Digite a localização completa"
            />
            
            {/* Telefone */}
            <CustomInput
              type="tel"
              label="Telefone"
              value={formData.telefone}
              onChange={(value) => handleInputChange('telefone', value)}
              required
              iconStart={<Phone className="text-gray-500" />}
              errorMessage={submitted && errors.telefone}
              disabled={loading}
              id="telefone"
              placeholder="912345678"
              maxLength={9}
            />
            
            {/* Telefone Opcional */}
            <CustomInput
              type="tel"
              label="Telefone Opcional"
              value={formData.telefone_opcional}
              onChange={(value) => handleInputChange('telefone_opcional', value)}
              iconStart={<Phone className="text-gray-500" />}
              errorMessage={submitted && errors.telefone_opcional}
              disabled={loading}
              id="telefone_opcional"
              placeholder="912345678 (opcional)"
              maxLength={9}
            />
            
            {/* Email */}
            <CustomInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              iconStart={<Mail className="text-gray-500" />}
              errorMessage={submitted && errors.email}
              disabled={loading}
              id="email"
              placeholder="exemplo@email.com"
            />
            
            {/* Website */}
            <CustomInput
              type="text"
              label="Website"
              value={formData.website}
              onChange={(value) => handleInputChange('website', value)}
              iconStart={<Globe className="text-gray-500" />}
              errorMessage={submitted && errors.website}
              disabled={loading}
              id="website"
              placeholder="www.exemplo.com (opcional)"
            />
            
            {/* Redes Sociais */}
            <CustomInput
              type="text"
              label="Redes Sociais"
              value={formData.redes_sociais}
              onChange={(value) => handleInputChange('redes_sociais', value)}
              iconStart={<Facebook className="text-gray-500" />}
              errorMessage={submitted && errors.redes_sociais}
              disabled={loading}
              id="redes_sociais"
              placeholder="@exemplo (opcional)"
            />
            
            {/* Número de Participantes */}
            <CustomInput
              type="number"
              label="Número de Vagas"
              value={formData.numero_participantes}
              onChange={(value) => handleInputChange('numero_participantes', parseInt(value) || 0)}
              required
              iconStart={<Users className="text-gray-500" />}
              errorMessage={submitted && errors.numero_participantes}
              disabled={loading}
              id="numero_participantes"
              placeholder="Digite o número de vagas"
              min="1"
            />
            
            {/* Data de Início */}
            <CustomInput
              type="date"
              label="Data de Início"
              value={formData.data_inicio}
              onChange={(value) => handleInputChange('data_inicio', value)}
              required
              iconStart={<Calendar className="text-gray-500" />}
              errorMessage={submitted && errors.data_inicio}
              disabled={loading}
              id="data_inicio"
              minDate={new Date()}
            />
            
            {/* Data de Término */}
            <CustomInput
              type="date"
              label="Data de Término"
              value={formData.data_termino}
              onChange={(value) => handleInputChange('data_termino', value)}
              required
              iconStart={<Calendar className="text-gray-500" />}
              errorMessage={submitted && errors.data_termino}
              disabled={loading}
              id="data_termino"
              minDate={formData.data_inicio || new Date()}
            />
            
            {/* Descrição */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <CustomInput
                type="textarea"
                label="Descrição"
                value={formData.descricao}
                onChange={(value) => handleInputChange('descricao', value)}
                required
                iconStart={<AlignLeft className="text-gray-500" />}
                errorMessage={submitted && errors.descricao}
                disabled={loading}
                id="descricao"
                placeholder="Descreva a atividade em detalhes"
                rows={4}
              />
            </div>
          </div>
          
          {/* Botões */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center justify-end">
              {/* Botão Resetar */}
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800 flex items-center"
                disabled={loading}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Limpar
              </button>
              
              {/* Botão Cadastrar */}
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
                    <Save className="w-5 h-5 mr-2" />
                    Cadastrar
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityRegistrationFormNacional;