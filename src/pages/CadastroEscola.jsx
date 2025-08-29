import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  School, MapPin, Mail, Phone, Building, Calendar,
  Users, GraduationCap, FileText, Upload, Save, X, AlertCircle,
  FileSpreadsheet, Eye, CheckSquare, RotateCcw, Home, User
} from 'lucide-react';
import * as XLSX from 'xlsx';
import CustomInput from '../components/CustomInput';
import provinciasData from '../components/Provincias.json'; // Importando dados estáticos das províncias

// Dados estáticos das administrações regionais
const administracoesEstaticas = [
  { id: 1, nome: "Administração Regional de Luanda" },
  { id: 2, nome: "Administração Regional de Benguela" },
  { id: 3, nome: "Administração Regional de Huambo" },
  { id: 4, nome: "Administração Regional de Huíla" },
  { id: 5, nome: "Administração Regional de Cabinda" }
];

const CadastroEscola = () => {
  // Estados
  const [formData, setFormData] = useState({
    nome: '',
    codigo: '',
    tipoEnsino: '',
    niveisEnsino: [],
    diretor: '',
    provincia: '',
    municipio: '',
    endereco: '',
    bairro: '',
    telefone: '',
    email: '',
    dataFundacao: null,
    capacidadeAlunos: '',
    numeroSalas: '',
    infraestrutura: [],
    observacoes: '',
    status: 'ATIVO',
    adminRegionalId: null
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [showExcelPreview, setShowExcelPreview] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);

  // Opções para administrações regionais
  const administracoesOptions = administracoesEstaticas.map(adm => ({
    label: adm.nome,
    value: Number(adm.id)
  }));

  // Opções para tipo de ensino
  const tipoEnsinoOptions = [
    { label: 'Ensino Geral', value: 'GERAL' },
    { label: 'Ensino Técnico-Profissional', value: 'TECNICO_PROFISSIONAL' },
    { label: 'Ensino Misto (Geral + Técnico)', value: 'MISTO' }
  ];

  // Opções para níveis de ensino
  const niveisEnsinoOptions = [
    { label: 'Ensino Primário (1ª à 6ª classe)', value: 'PRIMARIO' },
    { label: '1º Ciclo Secundário (7ª à 9ª classe)', value: 'SECUNDARIO_1_CICLO' },
    { label: '2º Ciclo Secundário (10ª à 12ª classe)', value: 'SECUNDARIO_2_CICLO' },
    { label: 'Ensino Técnico Médio', value: 'TECNICO_MEDIO' },
    { label: 'Formação Profissional', value: 'FORMACAO_PROFISSIONAL' }
  ];

  // Opções para infraestrutura
  const infraestruturaOptions = [
    { label: 'Biblioteca', value: 'BIBLIOTECA' },
    { label: 'Laboratório de Informática', value: 'LAB_INFORMATICA' },
    { label: 'Laboratório de Ciências', value: 'LAB_CIENCIAS' },
    { label: 'Quadra Desportiva', value: 'QUADRA_DESPORTIVA' },
    { label: 'Cantina/Refeitório', value: 'CANTINA' },
    { label: 'Sala de Professores', value: 'SALA_PROFESSORES' },
    { label: 'Secretaria', value: 'SECRETARIA' },
    { label: 'Auditório', value: 'AUDITORIO' },
    { label: 'Oficinas Técnicas', value: 'OFICINAS_TECNICAS' }
  ];

  const handleProvinciaChange = (value) => {
    handleInputChange('provincia', value);

    const provinciaValue = value?.value || value;
    const provinciaSelected = provinciasData.find(
      p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
    );

    if (provinciaSelected) {
      try {
        const municipiosArray = JSON.parse(provinciaSelected.municipios);
        const municipios = municipiosArray.map(mun => ({
          label: mun,
          value: mun
        }));
        setMunicipiosOptions(municipios);
      } catch (error) {
        console.error("Erro ao processar municípios:", error);
        setMunicipiosOptions([]);
      }
    } else {
      setMunicipiosOptions([]);
    }

    handleInputChange('municipio', '');
  };

  // Mapeamento de campos para importação Excel
  const fieldMapping = {
    nome: ['nome', 'nome da escola', 'escola', 'instituicao', 'name'],
    codigo: ['codigo', 'code', 'codigo escola'],
    diretor: ['diretor', 'responsavel', 'gestor', 'principal'],
    provincia: ['provincia', 'province'],
    municipio: ['municipio', 'district'],
    endereco: ['endereco', 'endereço', 'rua', 'street', 'address'],
    bairro: ['bairro', 'neighborhood'],
    telefone: ['telefone', 'fone', 'celular', 'contacto', 'phone'],
    email: ['email', 'e-mail', 'correio'],
    dataFundacao: ['dataFundacao', 'data_fundacao', 'fundacao', 'data'],
    capacidadeAlunos: ['capacidade', 'capacidade_alunos', 'alunos', 'students'],
    numeroSalas: ['salas', 'numero_salas', 'classrooms']
  };

  // Handler para mostrar toast
  const showToast = useCallback((type, title, message, duration = 5000) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    setToastMessage({ type, title, message });

    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, duration);

    setToastTimeout(timeout);
  }, [toastTimeout]);

  // Função para encontrar campo correspondente no Excel
  const findMatchingField = useCallback((headers, fieldOptions) => {
    const normalizedHeaders = headers.map(h => h.toLowerCase().trim());
    return fieldOptions.find(option =>
      normalizedHeaders.includes(option.toLowerCase().trim())
    );
  }, []);

  // Função para validar o formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = [
      'nome', 'tipoEnsino', 'niveisEnsino', 'diretor',
      'provincia', 'municipio', 'endereco', 'telefone',
      'email', 'dataFundacao', 'adminRegionalId'
    ];

    requiredFields.forEach(field => {
      if (field === 'niveisEnsino') {
        if (!formData[field] || formData[field].length === 0) {
          newErrors[field] = 'Selecione pelo menos um nível de ensino.';
        }
      } else if (!formData[field]?.toString().trim()) {
        newErrors[field] = `O campo ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} é obrigatório.`;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Função para lidar com mudança nos campos
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

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
      codigo: '',
      tipoEnsino: '',
      niveisEnsino: [],
      diretor: '',
      provincia: '',
      municipio: '',
      endereco: '',
      bairro: '',
      telefone: '',
      email: '',
      dataFundacao: null,
      capacidadeAlunos: '',
      numeroSalas: '',
      infraestrutura: [],
      observacoes: '',
      status: 'ATIVO',
      adminRegionalId: null
    });
    setSubmitted(false);
    setErrors({});
  }, []);

  // Função para processar datas do Excel
  const parseExcelDate = useCallback((dateValue) => {
    if (!dateValue) return new Date().toISOString().split('T')[0];

    try {
      if (typeof dateValue === 'number') {
        const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
        return excelDate.toISOString().split('T')[0];
      }

      let date;
      if (typeof dateValue === 'string') {
        if (dateValue.includes('-')) {
          const parts = dateValue.split('-');
          date = parts[0].length === 4 ? new Date(dateValue) : new Date(parts[2], parts[1] - 1, parts[0]);
        } else if (dateValue.includes('/')) {
          const parts = dateValue.split('/');
          date = new Date(parts[2], parts[1] - 1, parts[0]);
        } else {
          date = new Date(dateValue);
        }
      } else {
        date = new Date(dateValue);
      }

      return date.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erro ao processar data:', dateValue, error);
      return new Date().toISOString().split('T')[0];
    }
  }, []);

  // Função para processar upload de Excel
  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, {
        cellDates: true,
        dateNF: 'dd/mm/yyyy'
      });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(worksheet, {
        raw: true,
        defval: ''
      });

      const headers = Object.keys(rawData[0] || {});

      const mappedData = rawData.map(row => {
        const mappedRow = {};

        for (const [fieldName, possibleNames] of Object.entries(fieldMapping)) {
          const matchingHeader = findMatchingField(headers, possibleNames);
          if (matchingHeader) {
            let value = row[matchingHeader];

            switch (fieldName) {
              case 'dataFundacao':
                value = parseExcelDate(value);
                break;
              case 'telefone':
                value = value?.toString() || '';
                break;
              case 'capacidadeAlunos':
              case 'numeroSalas':
                value = value ? Number(value) : 0;
                break;
              default:
                value = value || '';
            }

            mappedRow[fieldName] = value;
          }
        }

        return mappedRow;
      });

      setExcelData(mappedData);

      if (mappedData.length > 0) {
        setShowExcelPreview(true);
        showToast('success', 'Sucesso', `${mappedData.length} registros encontrados no Excel.`);
      } else {
        showToast('warning', 'Atenção', 'Nenhum registro válido encontrado no Excel.');
      }
    } catch (error) {
      console.error('Erro ao processar arquivo Excel:', error);
      showToast('error', 'Erro', 'Erro ao processar o arquivo Excel. Verifique o formato.');
    } finally {
      setLoading(false);
    }
  };

  // Função para cadastro em lote (simulado)
  const handleBulkSubmit = async () => {
    const dataToProcess = selectedRows.length > 0 ? selectedRows : excelData;

    if (dataToProcess.length === 0) {
      showToast('warning', 'Atenção', 'Selecione pelo menos um registro para cadastrar.');
      return;
    }

    setShowProgress(true);
    setProcessingProgress(0);

    try {
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < dataToProcess.length; i++) {
        // Simular processamento
        await new Promise(resolve => setTimeout(resolve, 100));

        try {
          // Simular sucesso/erro aleatório
          if (Math.random() > 0.1) {
            successCount++;
          } else {
            errorCount++;
          }
        } catch (error) {
          errorCount++;
        }

        setProcessingProgress(((i + 1) / dataToProcess.length) * 100);
      }

      showToast(
        successCount > 0 ? 'success' : 'error',
        'Processamento Concluído',
        `${successCount} escolas cadastradas com sucesso. ${errorCount} erros.`
      );

      if (successCount > 0) {
        setShowExcelPreview(false);
        setExcelData([]);
        setSelectedRows([]);
      }
    } catch (error) {
      console.error('Erro no processamento em lote:', error);
      showToast('error', 'Erro', 'Erro ao processar registros do Excel.');
    } finally {
      setShowProgress(false);
    }
  };

  // Função para enviar o formulário (simulado)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    if (!validateForm()) {
      showToast('error', 'Formulário Incompleto', 'Verifique os campos destacados em vermelho.');
      return;
    }

    setLoading(true);
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Dados da escola:', formData);
      showToast('success', 'Sucesso', 'Escola cadastrada com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar escola:', error);
      showToast('error', 'Erro', 'Erro ao cadastrar escola. Tente novamente.');
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
    <div className="bg-white rounded-xl w-full">
      {/* Toast para notificações */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 animate-fade-in
          ${toastMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' :
            toastMessage.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' :
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
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6 p-6 border-b border-gray-100">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Sistema de Cadastro de Escolas</h1>
          <p className="text-gray-600">Subsistemas de Ensino Geral e Técnico-Profissional - Angola</p>
          <p className="text-sm text-gray-500 mt-1">Preencha todos os campos obrigatórios (*)</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nome da Escola */}
            <CustomInput
              type="text"
              label="Nome da Escola"
              value={formData.nome}
              onChange={(value) => handleInputChange('nome', value)}
              required
              iconStart={<School size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.nome}
              disabled={loading}
              placeholder="Digite o nome da escola"
            />

            {/* Código da Escola */}
            <CustomInput
              type="text"
              label="Código da Escola"
              value={formData.codigo}
              onChange={(value) => handleInputChange('codigo', value)}
              iconStart={<FileText size={18} className="text-gray-500" />}
              disabled={loading}
              placeholder="Ex: ESC001"
            />

            {/* Tipo de Ensino */}
            <CustomInput
              type="select"
              label="Tipo de Ensino"
              options={tipoEnsinoOptions}
              value={formData.tipoEnsino}
              onChange={(value) => handleInputChange('tipoEnsino', value)}
              required
              iconStart={<GraduationCap size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.tipoEnsino}
              disabled={loading}
              placeholder="Selecione o tipo de ensino"
            />



            {/* Diretor */}
            <CustomInput
              type="text"
              label="Diretor/Responsável"
              value={formData.diretor}
              onChange={(value) => handleInputChange('diretor', value)}
              required
              iconStart={<User size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.diretor}
              disabled={loading}
              placeholder="Nome do diretor ou responsável"
            />

            {/* Província */}
            <CustomInput
              type="select"
              label="Província"
              options={provinciasData.map(provincia => ({
                label: provincia.nome,
                value: provincia.nome.toUpperCase()
              }))}
              value={formData.provincia}
              onChange={handleProvinciaChange}
              required
              iconStart={<MapPin size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.provincia}
              disabled={loading}
              placeholder="Selecione a província"
            />

            {/* Município */}
            <CustomInput
              type="select"
              label="Município"
              options={municipiosOptions}
              value={formData.municipio}
              onChange={(value) => handleInputChange('municipio', value)}
              required
              iconStart={<MapPin size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.municipio}
              disabled={loading || !formData.provincia}
              placeholder="Selecione o município"
            />

            {/* Endereço */}
            <CustomInput
              type="text"
              label="Endereço"
              value={formData.endereco}
              onChange={(value) => handleInputChange('endereco', value)}
              required
              iconStart={<Home size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.endereco}
              disabled={loading}
              placeholder="Rua, número, quarteirão..."
            />

            {/* Bairro */}
            <CustomInput
              type="text"
              label="Bairro"
              value={formData.bairro}
              onChange={(value) => handleInputChange('bairro', value)}
              iconStart={<MapPin size={18} className="text-gray-500" />}
              disabled={loading}
              placeholder="Nome do bairro"
            />

            {/* Telefone */}
            <CustomInput
              type="tel"
              label="Telefone"
              value={formData.telefone}
              onChange={(value) => handleInputChange('telefone', value)}
              required
              iconStart={<Phone size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.telefone}
              disabled={loading}
              placeholder="912345678"
              maxLength={9}
            />

            {/* Email */}
            <CustomInput
              type="email"
              label="Email"
              value={formData.email}
              onChange={(value) => handleInputChange('email', value)}
              required
              iconStart={<Mail size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.email}
              disabled={loading}
              placeholder="escola@exemplo.com"
            />

            {/* Data de Fundação */}
            <CustomInput
              type="date"
              label="Data de Fundação"
              value={formData.dataFundacao}
              onChange={(value) => handleInputChange('dataFundacao', value)}
              required
              iconStart={<Calendar size={18} className="text-gray-500" />}
              errorMessage={submitted && errors.dataFundacao}
              disabled={loading}
              maxDate={new Date()}
            />

            {/* Capacidade de Alunos */}
            <CustomInput
              type="number"
              label="Capacidade de Alunos"
              value={formData.capacidadeAlunos}
              onChange={(value) => handleInputChange('capacidadeAlunos', value)}
              iconStart={<Users size={18} className="text-gray-500" />}
              disabled={loading}
              placeholder="Ex: 500"
            />

            {/* Número de Salas */}
            <CustomInput
              type="number"
              label="Número de Salas"
              value={formData.numeroSalas}
              onChange={(value) => handleInputChange('numeroSalas', value)}
              iconStart={<Building size={18} className="text-gray-500" />}
              disabled={loading}
              placeholder="Ex: 20"
            />

            {/* Níveis de Ensino */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Níveis de Ensino Oferecidos <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border rounded-lg p-3">
                {niveisEnsinoOptions.map((nivel) => (
                  <label key={nivel.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.niveisEnsino.includes(nivel.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('niveisEnsino', [...formData.niveisEnsino, nivel.value]);
                        } else {
                          handleInputChange('niveisEnsino', formData.niveisEnsino.filter(n => n !== nivel.value));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{nivel.label}</span>
                  </label>
                ))}
              </div>
              {submitted && errors.niveisEnsino && (
                <p className="mt-1 text-sm text-red-600">{errors.niveisEnsino}</p>
              )}
            </div>

            {/* Infraestrutura */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Infraestrutura Disponível
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border rounded-lg p-3">
                {infraestruturaOptions.map((infra) => (
                  <label key={infra.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.infraestrutura.includes(infra.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('infraestrutura', [...formData.infraestrutura, infra.value]);
                        } else {
                          handleInputChange('infraestrutura', formData.infraestrutura.filter(i => i !== infra.value));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{infra.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Observações */}
            <div className="lg:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                disabled={loading}
                placeholder="Informações adicionais sobre a escola..."
                rows={4}
                maxLength={500}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {formData.observacoes.length}/500 caracteres
              </div>
            </div>
          </div>

          {/* Importação Excel e Botões */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 items-center">
              {/* Upload de Excel */}
              <div className="flex items-center">
                <label
                  htmlFor="excel-upload"
                  className="flex items-center justify-center px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors"
                >
                  <FileSpreadsheet size={18} className="w-5 h-5 mr-2" />
                  Importar Excel
                </label>
                <input
                  id="excel-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelUpload}
                  className="hidden"
                  disabled={loading}
                />
              </div>

              {/* Botão para mostrar prévia do Excel */}
              {excelData.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowExcelPreview(true)}
                  className="flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Eye size={18} className="w-5 h-5 mr-2" />
                  Ver Dados ({excelData.length})
                </button>
              )}

              {/* Espaçador */}
              <div className="flex-grow"></div>

              {/* Botão Resetar */}
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800 flex items-center"
                disabled={loading}
              >
                <RotateCcw size={18} className="w-4 h-4 mr-2" />
                Limpar
              </button>

              {/* Botão Cadastrar */}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Save size={18} className="w-5 h-5 mr-2" />
                    Cadastrar Escola
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de Prévia do Excel */}
      {showExcelPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col animate-fade-in">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Prévia dos Dados do Excel
              </h2>
              <button
                onClick={() => setShowExcelPreview(false)}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Barra de Progresso */}
            {showProgress && (
              <div className="p-4 border-b border-gray-200">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm text-gray-600">
                  Processando registros... {Math.round(processingProgress)}%
                </p>
              </div>
            )}

            {/* Tabela de dados */}
            <div className="overflow-auto flex-grow p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-10 p-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedRows.length === excelData.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRows([...excelData]);
                          } else {
                            setSelectedRows([]);
                          }
                        }}
                      />
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome da Escola
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Diretor
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Província
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Município
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Telefone
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Capacidade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {excelData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2">
                        <input
                          type="checkbox"
                          className="w-4 h-4"
                          checked={selectedRows.some(r => r === row)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRows([...selectedRows, row]);
                            } else {
                              setSelectedRows(selectedRows.filter(r => r !== row));
                            }
                          }}
                        />
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800 font-medium">
                        {row.nome}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {row.diretor}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {row.provincia}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {row.municipio}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {row.telefone}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {row.email}
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-800">
                        {row.capacidadeAlunos}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {selectedRows.length} de {excelData.length} registros selecionados
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowExcelPreview(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBulkSubmit}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  disabled={selectedRows.length === 0 && excelData.length === 0}
                >
                  <Upload size={18} className="w-5 h-5 mr-2" />
                  Cadastrar Selecionados
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card informativo sobre os subsistemas */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center text-blue-700 mb-4">
          <School className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Sistema Educativo de Angola</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Subsistema de Ensino Geral:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Ensino Primário: 1ª à 6ª classe (idades 6-11)</li>
              <li>• 1º Ciclo Secundário: 7ª à 9ª classe (idades 12-14)</li>
              <li>• 2º Ciclo Secundário: 10ª à 12ª classe (idades 15-17)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Subsistema Técnico-Profissional:</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• Ensino Técnico Médio (3 anos)</li>
              <li>• Formação Profissional</li>
              <li>• Especialização Técnica</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-white rounded border border-blue-200">
          <p className="text-blue-700 text-sm">
            <strong>Importante:</strong> As escolas podem oferecer múltiplos níveis de ensino.
            Escolas mistas podem combinar tanto o ensino geral quanto o técnico-profissional,
            proporcionando maior flexibilidade educacional aos estudantes.
          </p>
        </div>
      </div>

      {/* Card com informações sobre infraestrutura */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center text-green-700 mb-4">
          <Building className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Infraestrutura Educacional</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Infraestrutura Básica:</h4>
            <ul className="space-y-1 text-green-700">
              <li>• Salas de aula adequadas</li>
              <li>• Secretaria administrativa</li>
              <li>• Sala de professores</li>
              <li>• Instalações sanitárias</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-green-800 mb-2">Infraestrutura Complementar:</h4>
            <ul className="space-y-1 text-green-700">
              <li>• Biblioteca escolar</li>
              <li>• Laboratórios especializados</li>
              <li>• Quadra desportiva</li>
              <li>• Cantina/Refeitório</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-green-800 mb-2">Infraestrutura Técnica:</h4>
            <ul className="space-y-1 text-green-700">
              <li>• Laboratório de informática</li>
              <li>• Oficinas técnicas</li>
              <li>• Auditório/Sala de eventos</li>
              <li>• Equipamentos especializados</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Card com estatísticas (simuladas) */}
      <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-center text-purple-700 mb-4">
          <GraduationCap className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-semibold">Estatísticas do Sistema</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">1,247</div>
            <div className="text-sm text-purple-600">Escolas Cadastradas</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">68%</div>
            <div className="text-sm text-purple-600">Ensino Geral</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">24%</div>
            <div className="text-sm text-purple-600">Técnico-Profissional</div>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-800">8%</div>
            <div className="text-sm text-purple-600">Ensino Misto</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroEscola;