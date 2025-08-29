import React, { useState } from 'react';
import {
  User,
  Building,
  MapPin,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
  Users,
  Phone,
  Mail,
  Calendar
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';

// Dados das províncias do JSON
const provinciasData = [
  { nome: 'Bengo', value: 'BENGO' },
  { nome: 'Benguela', value: 'BENGUELA' },
  { nome: 'Cuanza Norte', value: 'CUANZA_NORTE' },
  { nome: 'Cuanza Sul', value: 'CUANZA_SUL' },
  { nome: 'Cunene', value: 'CUNENE' },
  { nome: 'Cubango', value: 'CUBANGO' },
  { nome: 'Cabinda', value: 'CABINDA' },
  { nome: 'Luanda', value: 'LUANDA' },
  { nome: 'Lunda Norte', value: 'LUNDA_NORTE' },
  { nome: 'Lunda Sul', value: 'LUNDA_SUL' },
  { nome: 'Malanje', value: 'MALANJE' },
  { nome: 'Moxico', value: 'MOXICO' },
  { nome: 'Namibe', value: 'NAMIBE' },
  { nome: 'Uíge', value: 'UIGE' },
  { nome: 'Zaire', value: 'ZAIRE' },
  { nome: 'Bié', value: 'BIE' },
  { nome: 'Huambo', value: 'HUAMBO' },
  { nome: 'Huíla', value: 'HUILA' },
  { nome: 'Icolo e Bengo', value: 'ICOLO_BENGO' },
  { nome: 'Cassai Zambeze', value: 'CASSAI_ZAMBEZE' },
  { nome: 'Cuando', value: 'CUANDO' }
];

// Dados das instituições
const instituicoesData = [
  { nome: 'Ministério da Agricultura', value: 'MINISTERIO_AGRICULTURA' },
  { nome: 'Direção Provincial', value: 'DIRECAO_PROVINCIAL' },
  { nome: 'Direção Municipal Agrícola', value: 'DIRECAO_MUNICIPAL_AGRICOLA' },
  { nome: 'IDA', value: 'IDA' },
  { nome: 'ISV', value: 'ISV' }
];

const CadastroAgentesCampo = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Estado inicial do formulário
  const initialState = {
    nome: '',
    provincia: '',
    instituicao: '',
    telefone: '',
    email: '',
    dataAdmissao: ''
  };

  const [formData, setFormData] = useState(initialState);

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome do agente é obrigatório';
    }

    if (!formData.provincia) {
      newErrors.provincia = 'Província é obrigatória';
    }

    if (!formData.instituicao) {
      newErrors.instituicao = 'Instituição é obrigatória';
    }

    if (formData.telefone && !/^\d{9}$/.test(formData.telefone.replace(/\s/g, ''))) {
      newErrors.telefone = 'Telefone deve ter 9 dígitos';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email deve ter um formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      showToast('error', 'Erro', 'Por favor, corrija os campos destacados.');
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const dataToSend = {
        ...formData,
        dataRegistro: new Date().toISOString(),
        // Converter valores para labels para melhor legibilidade
        provinciaLabel: provinciasData.find(p => p.value === formData.provincia)?.nome || formData.provincia,
        instituicaoLabel: instituicoesData.find(i => i.value === formData.instituicao)?.nome || formData.instituicao
      };

      // Simulação de envio para API
      console.log("📤 Dados do Agente de Campo enviados para a API:");
      console.log(JSON.stringify(dataToSend, null, 2));

      // Simular sucesso após 2 segundos
      setTimeout(() => {
        setLoading(false);
        showToast('success', 'Sucesso', 'Agente de campo cadastrado com sucesso!');
        // Reset do formulário
        setFormData(initialState);
        setErrors({});
      }, 2000);

    } catch (error) {
      setLoading(false);
      console.error('Erro ao cadastrar agente:', error);
      showToast('error', 'Erro', 'Erro ao cadastrar agente. Tente novamente.');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${
          toastMessage.severity === 'success' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
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
          <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Agentes de Campo</h1>
            <p className="text-xl text-gray-700 mb-2">Sistema de Registro de Agentes Agrícolas</p>
            <p className="text-sm text-gray-600">República de Angola • Ministério da Agricultura e Florestas</p>
          </div>

          {/* Formulário */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Nome do Agente */}
              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Nome Completo do Agente"
                  value={formData.nome}
                  onChange={(value) => handleInputChange('nome', value)}
                  required
                  errorMessage={errors.nome}
                  placeholder="Digite o nome completo do agente de campo"
                  iconStart={<User size={18} />}
                />
              </div>

              {/* Província */}
              <CustomInput
                type="select"
                label="Província"
                value={formData.provincia ? { 
                  label: provinciasData.find(p => p.value === formData.provincia)?.nome, 
                  value: formData.provincia 
                } : null}
                options={provinciasData.map(provincia => ({
                  label: provincia.nome,
                  value: provincia.value
                }))}
                onChange={(option) => handleInputChange('provincia', option?.value || '')}
                required
                errorMessage={errors.provincia}
                placeholder="Selecione a província de atuação"
                iconStart={<MapPin size={18} />}
              />

              {/* Instituição */}
              <CustomInput
                type="select"
                label="Instituição"
                value={formData.instituicao ? { 
                  label: instituicoesData.find(i => i.value === formData.instituicao)?.nome, 
                  value: formData.instituicao 
                } : null}
                options={instituicoesData.map(instituicao => ({
                  label: instituicao.nome,
                  value: instituicao.value
                }))}
                onChange={(option) => handleInputChange('instituicao', option?.value || '')}
                required
                errorMessage={errors.instituicao}
                placeholder="Selecione a instituição vinculada"
                iconStart={<Building size={18} />}
              />

              {/* Telefone */}
              <CustomInput
                type="tel"
                label="Telefone (Opcional)"
                value={formData.telefone}
                onChange={(value) => handleInputChange('telefone', value)}
                errorMessage={errors.telefone}
                placeholder="Ex: 999 123 456"
                iconStart={<Phone size={18} />}
                helperText="Formato: 9 dígitos"
              />

              {/* Email */}
              <CustomInput
                type="email"
                label="Email (Opcional)"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                errorMessage={errors.email}
                placeholder="exemplo@email.ao"
                iconStart={<Mail size={18} />}
              />

              {/* Data de Admissão */}
              <CustomInput
                type="date"
                label="Data de Admissão (Opcional)"
                value={formData.dataAdmissao}
                onChange={(value) => handleInputChange('dataAdmissao', value)}
                iconStart={<Calendar size={18} />}
                helperText="Data de entrada na instituição"
              />
            </div>

            {/* Resumo dos Dados */}
            {(formData.nome || formData.provincia || formData.instituicao) && (
              <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Resumo do Cadastro
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {formData.nome && (
                    <div>
                      <span className="block font-semibold text-blue-700">Agente:</span>
                      <span className="text-blue-600">{formData.nome}</span>
                    </div>
                  )}
                  {formData.provincia && (
                    <div>
                      <span className="block font-semibold text-blue-700">Província:</span>
                      <span className="text-blue-600">
                        {provinciasData.find(p => p.value === formData.provincia)?.nome}
                      </span>
                    </div>
                  )}
                  {formData.instituicao && (
                    <div>
                      <span className="block font-semibold text-blue-700">Instituição:</span>
                      <span className="text-blue-600">
                        {instituicoesData.find(i => i.value === formData.instituicao)?.nome}
                      </span>
                    </div>
                  )}
                  {formData.telefone && (
                    <div>
                      <span className="block font-semibold text-blue-700">Telefone:</span>
                      <span className="text-blue-600">{formData.telefone}</span>
                    </div>
                  )}
                  {formData.email && (
                    <div>
                      <span className="block font-semibold text-blue-700">Email:</span>
                      <span className="text-blue-600">{formData.email}</span>
                    </div>
                  )}
                  {formData.dataAdmissao && (
                    <div>
                      <span className="block font-semibold text-blue-700">Data de Admissão:</span>
                      <span className="text-blue-600">
                        {new Date(formData.dataAdmissao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Botão de Envio */}
            <div className="mt-8 flex justify-start">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`px-12 py-4 rounded-xl flex items-center transition-all font-medium text-lg shadow-lg ${
                  loading 
                    ? 'bg-gray-300 cursor-not-allowed text-gray-600'
                    : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl transform hover:-translate-y-0.5'
                }`}
              >
                {loading ? (
                  <>
                    <Loader size={24} className="animate-spin mr-3" />
                    Cadastrando Agente...
                  </>
                ) : (
                  <>
                    <Users size={24} className="mr-3" />
                    Cadastrar Agente
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Information Card */}
        <div className="mt-8 bg-white p-8 shadow-sm rounded-2xl border border-gray-200">
          <div className="flex items-center text-blue-700 mb-4">
            <Info size={20} className="mr-3" />
            <h3 className="text-xl font-semibold">Sobre o Cadastro de Agentes de Campo</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Objetivo:</h4>
              <p className="leading-relaxed">
                O cadastro de agentes de campo permite o registro e acompanhamento dos profissionais 
                que atuam diretamente com produtores e comunidades rurais, facilitando a coordenação 
                das atividades de extensão agrícola.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Benefícios:</h4>
              <ul className="space-y-2 leading-relaxed">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Controle dos recursos humanos no campo
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Coordenação das atividades de extensão
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Melhoria na prestação de serviços
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Facilitação da comunicação institucional
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-700 text-sm leading-relaxed">
              <strong>Instituições Participantes:</strong> Ministério da Agricultura, Direções Provinciais 
              e Municipais de Agricultura, Instituto de Desenvolvimento Agrário (IDA) e Instituto de 
              Serviços Veterinários (ISV).
            </p>
          </div>
        </div>

        {/* Card de Estatísticas das Instituições */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center text-blue-700 mb-6">
            <Building size={20} className="mr-3" />
            <h3 className="text-xl font-semibold">Instituições do Sistema Agrícola</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Nível Central</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Ministério da Agricultura e Florestas</li>
                <li>• Instituto de Desenvolvimento Agrário (IDA)</li>
                <li>• Instituto de Serviços Veterinários (ISV)</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-3">Nível Provincial</h4>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Direções Provinciais de Agricultura</li>
                <li>• Delegações do IDA</li>
                <li>• Delegações do ISV</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-3">Nível Municipal</h4>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• Direções Municipais de Agricultura</li>
                <li>• Postos Municipais do IDA</li>
                <li>• Postos Municipais do ISV</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroAgentesCampo;