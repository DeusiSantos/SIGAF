import React, { useState } from 'react';
import CustomInput from './CustomInput';
import { 
  Mail, Phone, User, Building, BookOpen, 
  Calendar, MessageSquare, Lock, Globe, Award
} from 'lucide-react';

const FormDemo = () => {
  // Estado para os campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    categoria: null,
    dataNascimento: null,
    habilidades: [],
    bio: '',
    website: '',
    termos: false
  });
  
  // Estado para erros de validação
  const [errors, setErrors] = useState({});
  
  // Opções para selects
  const categorias = [
    { value: 'lobo', label: 'Alcateia (Lobitos)' },
    { value: 'exp', label: 'Exploradores' },
    { value: 'pio', label: 'Pioneiros' },
    { value: 'cam', label: 'Caminheiros' },
    { value: 'dir', label: 'Dirigentes' }
  ];
  
  const habilidades = [
    { value: 'primeiros-socorros', label: 'Primeiros Socorros' },
    { value: 'acampamento', label: 'Técnicas de Acampamento' },
    { value: 'navegacao', label: 'Navegação e Orientação' },
    { value: 'cozinha', label: 'Cozinha de Campo' },
    { value: 'rastreamento', label: 'Rastreamento' },
    { value: 'comunicacao', label: 'Comunicação' },
    { value: 'lideranca', label: 'Liderança' },
    { value: 'jogos', label: 'Jogos e Dinâmicas' },
    { value: 'fauna', label: 'Conhecimento de Fauna' },
    { value: 'flora', label: 'Conhecimento de Flora' }
  ];
  
  // Manipulador de mudança de campos
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro quando o campo é preenchido
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };
  
  // Validar formulário
  const validateForm = () => {
    const newErrors = {};
    
    // Validar nome
    if (!formData.nome) {
      newErrors.nome = 'O nome é obrigatório';
    }
    
    // Validar email
    if (!formData.email) {
      newErrors.email = 'O email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    // Validar senha
    if (!formData.senha) {
      newErrors.senha = 'A senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    // Validar categoria
    if (!formData.categoria) {
      newErrors.categoria = 'Selecione uma categoria';
    }
    
    // Validar data de nascimento
    if (!formData.dataNascimento) {
      newErrors.dataNascimento = 'Selecione uma data de nascimento';
    }
    
    // Validar termos
    if (!formData.termos) {
      newErrors.termos = 'Você deve concordar com os termos';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Manipulador de envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Dados do formulário:', formData);
      alert('Formulário enviado com sucesso!');
    } else {
      alert('Por favor, corrija os erros no formulário');
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Cadastro de Escuteiro</h2>
        <p className="text-gray-600 dark:text-gray-300">Preencha o formulário abaixo para registrar um novo escuteiro.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Seção de Informações Pessoais */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <User size={18} className="mr-2 text-blue-500" />
            Informações Pessoais
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <CustomInput
              type="text"
              label="Nome completo"
              value={formData.nome}
              onChange={(value) => handleChange('nome', value)}
              iconStart={<User size={18} />}
              placeholder="Digite o nome completo"
              required
              errorMessage={errors.nome}
              id="nome"
            />
            
            {/* Email */}
            <CustomInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              iconStart={<Mail size={18} />}
              placeholder="exemplo@email.com"
              required
              errorMessage={errors.email}
              id="email"
              helperText="Este email será usado para comunicações importantes"
            />
            
            {/* Telefone */}
            <CustomInput
              type="tel"
              label="Telefone"
              value={formData.telefone}
              onChange={(value) => handleChange('telefone', value)}
              iconStart={<Phone size={18} />}
              placeholder="(00) 00000-0000"
              id="telefone"
            />
            
            {/* Senha */}
            <CustomInput
              type="password"
              label="Senha"
              value={formData.senha}
              onChange={(value) => handleChange('senha', value)}
              iconStart={<Lock size={18} />}
              placeholder="Digite sua senha"
              required
              errorMessage={errors.senha}
              id="senha"
              helperText="Mínimo de 6 caracteres"
            />
          </div>
        </div>
        
        {/* Seção de Categoria e Habilidades */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <Award size={18} className="mr-2 text-blue-500" />
            Categoria e Habilidades
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Categoria */}
            <CustomInput
              type="select"
              label="Categoria"
              value={formData.categoria}
              onChange={(value) => handleChange('categoria', value)}
              iconStart={<Building size={18} />}
              options={categorias}
              placeholder="Selecione uma categoria"
              required
              errorMessage={errors.categoria}
              id="categoria"
            />
            
            {/* Data de Nascimento */}
            <CustomInput
              type="date"
              label="Data de Nascimento"
              value={formData.dataNascimento}
              onChange={(value) => handleChange('dataNascimento', value)}
              iconStart={<Calendar size={18} />}
              placeholder="Selecione uma data"
              required
              errorMessage={errors.dataNascimento}
              id="dataNascimento"
              minDate={new Date(1950, 0, 1)}
              maxDate={new Date()}
            />
            
            {/* Habilidades */}
            <div className="md:col-span-2">
              <CustomInput
                type="multiselect"
                label="Habilidades"
                value={formData.habilidades}
                onChange={(value) => handleChange('habilidades', value)}
                iconStart={<BookOpen size={18} />}
                options={habilidades}
                placeholder="Selecione suas habilidades"
                id="habilidades"
                helperText="Selecione todas as habilidades aplicáveis"
              />
            </div>
          </div>
        </div>
        
        {/* Informações Adicionais */}
        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4 flex items-center">
            <MessageSquare size={18} className="mr-2 text-blue-500" />
            Informações Adicionais
          </h3>
          
          <div className="space-y-4">
            {/* Website */}
            <CustomInput
              type="url"
              label="Website (opcional)"
              value={formData.website}
              onChange={(value) => handleChange('website', value)}
              iconStart={<Globe size={18} />}
              placeholder="https://exemplo.com"
              id="website"
            />
            
            {/* Biografia */}
            <CustomInput
              type="textarea"
              label="Biografia"
              value={formData.bio}
              onChange={(value) => handleChange('bio', value)}
              iconStart={<MessageSquare size={18} />}
              placeholder="Conte um pouco sobre você..."
              id="bio"
              rows={4}
              maxLength={500}
            />
          </div>
        </div>
        
        {/* Termos e Condições */}
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="termos"
              type="checkbox"
              checked={formData.termos}
              onChange={(e) => handleChange('termos', e.target.checked)}
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-purple-500"
            />
          </div>
          <label 
            htmlFor="termos" 
            className={`ml-2 text-sm font-medium ${errors.termos ? 'text-blue-500' : 'text-gray-700 dark:text-gray-300'}`}
          >
            Concordo com os <a href="#" className="text-purple-500 hover:underline dark:text-blue-500">termos de uso</a> e <a href="#" className="text-purple-500 hover:underline dark:text-blue-500">política de privacidade</a>.
          </label>
        </div>
        
        {/* Botões de Ação */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-purple-500 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormDemo;