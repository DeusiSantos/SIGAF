import React, { useEffect, useState } from 'react';
import {
    User,
    Home,
    Users,
    BookOpen,
    FileText,
    Check,
    ChevronRight,
    ChevronLeft,
    Calendar,
    MapPin,
    Map,
    Building,
    GraduationCap,
    AlertCircle,
    CheckCircle,
    Info,
    Loader,
    Globe,
    IdCard,
    Phone,
    Mail,
    School,
    Award,
    Briefcase,
    Clock
} from 'lucide-react';

import CustomInput from '../components/CustomInput';
import provinciasData from '../components/Provincias.json'; // Importar dados simulados das províncias


// Dados simulados das províncias angolanas


// Dados simulados de escolas por província
// Dados simulados de escolas por província
const escolasPorProvincia = {
    "Luanda": [
        { label: "Escola Primária Agostinho Neto", value: "escola_agostinho_neto", tipo: "GERAL", nivel: "PRIMARIO" },
        { label: "Escola Secundária Mutu Ya Kevela", value: "escola_mutu_ya_kevela", tipo: "GERAL", nivel: "SECUNDARIO" },
        { label: "Colégio São José de Cluny", value: "colegio_sao_jose", tipo: "GERAL", nivel: "PRIMARIO_SECUNDARIO" },
        { label: "Instituto Médio Técnico de Luanda", value: "imt_luanda", tipo: "TECNICO_PROFISSIONAL", nivel: "TECNICO_MEDIO" },
        { label: "Centro de Formação Profissional INEFOP", value: "cfp_inefop", tipo: "TECNICO_PROFISSIONAL", nivel: "FORMACAO_PROFISSIONAL" }
    ],
    "Benguela": [
        { label: "Escola Primária da Catumbela", value: "escola_catumbela", tipo: "GERAL", nivel: "PRIMARIO" },
        { label: "Escola Secundária de Benguela", value: "escola_sec_benguela", tipo: "GERAL", nivel: "SECUNDARIO" },
        { label: "Instituto Politécnico de Benguela", value: "instituto_benguela", tipo: "TECNICO_PROFISSIONAL", nivel: "TECNICO_MEDIO" }
    ],
    "Huíla": [
        { label: "Escola Primária do Lubango", value: "escola_lubango", tipo: "GERAL", nivel: "PRIMARIO" },
        { label: "Escola Secundária da Humpata", value: "escola_humpata", tipo: "GERAL", nivel: "SECUNDARIO" },
        { label: "Instituto Técnico de Turismo", value: "itt_huila", tipo: "TECNICO_PROFISSIONAL", nivel: "TECNICO_MEDIO" }
    ]
};

/**
 * Calcula a idade baseada na data de nascimento
 */
const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

/**
 * Campos obrigatórios por etapa
 */
const getRequiredFieldsByStep = (stepIndex) => {
    const requiredFieldsByStep = [
        // Identificação
        ['nome', 'dataNascimento', 'genero', 'naturalidade', 'numeroBI'],
        // Residência
        ['provinciaResidencia', 'municipioResidencia', 'bairro', 'telefone', 'email'],
        // Filiação
        ['nomePai', 'nomeMae'],
        // Profissional
        ['subsistemaEnsino', 'instituicaoEnsino', 'grauAcademico', 'especializacao'],
        // Documentos
        []
    ];
    return requiredFieldsByStep[stepIndex] || [];
};

const CadastrarProfessor = () => {
    // Estados principais
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);
    const [escolasOptions, setEscolasOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Estados de upload de arquivos
    const [uploadedFiles, setUploadedFiles] = useState({
        fotografia: null,
        bilheteIdentidade: null,
        certificadoAcademico: null,
        curriculo: null,
        outrosDocumentos: null
    });

    // Estado da mensagem toast
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);

    // Estado inicial do formulário
    const initialState = {
        // Identificação Pessoal
        nome: '',
        dataNascimento: null,
        genero: '',
        estadoCivil: '',
        naturalidade: '', // País de nascimento
        provinciaNascimento: '', // Só aparece se naturalidade for Angola
        numeroBI: '',

        // Residência
        provinciaResidencia: '',
        municipioResidencia: '',
        bairro: '',
        endereco: '',
        telefone: '',
        telefoneAlternativo: '',
        email: '',

        // Filiação
        nomePai: '',
        nomeMae: '',
        telefonePai: '',
        telefoneMae: '',
        profissaoPai: '',
        profissaoMae: '',

        // Informações Profissionais
        subsistemaEnsino: '', // GERAL ou TECNICO_PROFISSIONAL
        instituicaoEnsino: '',
        grauAcademico: '', // BACHARELADO, LICENCIATURA, MESTRADO, DOUTORADO
        especializacao: '', // Área de especialização
        tempoExperiencia: '', // Anos de experiência
        situacaoContratual: '', // EFETIVO, CONTRATADO, ESTAGIARIO
        numeroAgente: '', // Número de agente do professor
        salario: '',
        dataAdmissao: null,

        // Disciplinas e Níveis que leciona
        disciplinasLecionadas: [], // Array de disciplinas
        niveisEnsino: [], // Array de níveis que pode lecionar

        // Dados Específicos
        necessidadeEspecial: false,
        tipoNecessidadeEspecial: '',
        observacoes: '',

        // Situação
        status: 'ATIVO'
    };

    const [formData, setFormData] = useState(initialState);

    // Definição das etapas
    const steps = [
        { label: 'Identificação', icon: User },
        { label: 'Residência', icon: Home },
        { label: 'Filiação', icon: Users },
        { label: 'Profissional', icon: Briefcase },
        { label: 'Documentos', icon: FileText }
    ];

    // Buscar países na montagem do componente
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                setLoading(true);
                // Simulação de países - substitua pela API real
                const formattedCountries = [
                    { label: "Angola", value: "Angola" },
                    { label: "Brasil", value: "Brasil" },
                    { label: "Portugal", value: "Portugal" },
                    { label: "Cabo Verde", value: "Cabo Verde" },
                    { label: "Moçambique", value: "Moçambique" }
                ].sort((a, b) => a.label.localeCompare(b.label));

                setCountries(formattedCountries);
            } catch (error) {
                console.error('Erro ao buscar países:', error);
                showToast('error', 'Erro', 'Falha ao carregar a lista de países');
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    // Função para mostrar toast
    const showToast = (severity, summary, detail, duration = 3000) => {
        if (toastTimeout) clearTimeout(toastTimeout);

        setToastMessage({ severity, summary, detail, visible: true });

        const timeout = setTimeout(() => {
            setToastMessage(null);
        }, duration);

        setToastTimeout(timeout);
    };

    // Limpar timeout na desmontagem
    useEffect(() => {
        return () => {
            if (toastTimeout) clearTimeout(toastTimeout);
        };
    }, [toastTimeout]);

    // Validação da etapa atual
    const validateCurrentStep = () => {
        const requiredFields = getRequiredFieldsByStep(activeIndex);
        const newErrors = {};

        requiredFields.forEach(field => {
            if (!formData[field] || formData[field] === '') {
                newErrors[field] = 'Campo obrigatório';
                setTouched(prev => ({ ...prev, [field]: true }));
            }
        });

        // Validações específicas por etapa
        if (activeIndex === 0) {
            if (formData.dataNascimento) {
                const age = calculateAge(formData.dataNascimento);
                if (age < 18) {
                    newErrors.dataNascimento = 'Idade mínima para professor: 18 anos';
                }
            }
        }

        if (activeIndex === 1) {
            if (formData.email && !formData.email.includes('@')) {
                newErrors.email = 'Email inválido';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manipular mudanças nos inputs
    const handleInputChange = (field, value) => {
        setTouched(prev => ({ ...prev, [field]: true }));

        // Lógica especial para data de nascimento
        if (field === 'dataNascimento') {
            const age = calculateAge(value);

            if (age < 18) {
                setErrors(prev => ({ ...prev, dataNascimento: 'Idade mínima para professor: 18 anos' }));
                setFormData(prev => ({
                    ...prev,
                    dataNascimento: value
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                dataNascimento: value
            }));

            setErrors(prev => ({
                ...prev,
                dataNascimento: undefined
            }));
            return;
        }

        // Lógica para naturalidade
        if (field === 'naturalidade') {
            setFormData(prev => ({
                ...prev,
                naturalidade: value,
                provinciaNascimento: value?.value === 'Angola' ? prev.provinciaNascimento : ''
            }));
            return;
        }

        // Lógica para província de residência
        if (field === 'provinciaResidencia') {
            handleProvinciaChange(value);
            return;
        }

        // Lógica para subsistema de ensino
        if (field === 'subsistemaEnsino') {
            setFormData(prev => ({
                ...prev,
                subsistemaEnsino: value,
                instituicaoEnsino: ''
            }));

            // Filtrar escolas baseadas no subsistema e província
            if (formData.provinciaResidencia) {
                filterEscolasBySubsistema(formData.provinciaResidencia, value?.value);
            }
            return;
        }

        // Atualização normal
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Manipular mudança de província
    // Manipular mudança de província
    const handleProvinciaChange = (value) => {
        setFormData(prev => ({
            ...prev,
            provinciaResidencia: value,
            municipioResidencia: '',
            instituicaoEnsino: ''
        }));

        const provinciaValue = value?.value || value;
        const provinciaSelected = provinciasData.find(
            p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
        );

        if (provinciaSelected) {
            try {
                // Processar municípios - pode ser string JSON ou array
                let municipiosArray;
                if (typeof provinciaSelected.municipios === 'string') {
                    municipiosArray = JSON.parse(provinciaSelected.municipios);
                } else {
                    municipiosArray = provinciaSelected.municipios;
                }

                const municipios = municipiosArray.map(mun => ({
                    label: mun,
                    value: mun
                }));
                setMunicipiosOptions(municipios);

                // Atualizar escolas disponíveis
                const escolas = escolasPorProvincia[provinciaValue] || [];
                setEscolasOptions(escolas);
            } catch (error) {
                console.error("Erro ao processar municípios:", error);
                setMunicipiosOptions([]);
                setEscolasOptions([]);
            }
        } else {
            setMunicipiosOptions([]);
            setEscolasOptions([]);
        }
    };

    // Filtrar escolas por subsistema
    // Filtrar escolas por subsistema
    const filterEscolasBySubsistema = (provincia, subsistema) => {
        const provinciaValue = provincia?.value || provincia;
        const todasEscolas = escolasPorProvincia[provinciaValue] || [];

        if (subsistema) {
            const escolasFiltradas = todasEscolas.filter(escola => escola.tipo === subsistema);
            setEscolasOptions(escolasFiltradas);
        } else {
            setEscolasOptions(todasEscolas);
        }
    };

    // Manipular upload de arquivos
    const handleFileUpload = (fieldName, file) => {
        setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
        setFormData(prev => ({ ...prev, [fieldName]: file }));
    };

    // Submissão do formulário
    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();

            // Função para extrair valor
            const extractValue = (field) => {
                if (field && typeof field === 'object' && field.value !== undefined) {
                    return field.value;
                }
                return field;
            };

            // Mapear dados do formulário
            const mappedData = {
                Nome: formData.nome || '',
                DataNascimento: formData.dataNascimento
                    ? formData.dataNascimento.toISOString().split('T')[0]
                    : '',
                Genero: extractValue(formData.genero) || '',
                EstadoCivil: extractValue(formData.estadoCivil) || '',
                Naturalidade: extractValue(formData.naturalidade) || '',
                ProvinciaNascimento: extractValue(formData.provinciaNascimento) || '',
                NumeroBI: formData.numeroBI || '',
                ProvinciaResidencia: extractValue(formData.provinciaResidencia) || '',
                MunicipioResidencia: extractValue(formData.municipioResidencia) || '',
                Bairro: formData.bairro || '',
                Endereco: formData.endereco || '',
                Telefone: formData.telefone || '',
                TelefoneAlternativo: formData.telefoneAlternativo || '',
                Email: formData.email || '',
                NomePai: formData.nomePai || '',
                NomeMae: formData.nomeMae || '',
                TelefonePai: formData.telefonePai || '',
                TelefoneMae: formData.telefoneMae || '',
                ProfissaoPai: formData.profissaoPai || '',
                ProfissaoMae: formData.profissaoMae || '',
                SubsistemaEnsino: extractValue(formData.subsistemaEnsino) || '',
                InstituicaoEnsino: extractValue(formData.instituicaoEnsino) || '',
                GrauAcademico: extractValue(formData.grauAcademico) || '',
                Especializacao: formData.especializacao || '',
                TempoExperiencia: formData.tempoExperiencia || '',
                SituacaoContratual: extractValue(formData.situacaoContratual) || '',
                NumeroAgente: formData.numeroAgente || '',
                Salario: formData.salario || '',
                DataAdmissao: formData.dataAdmissao
                    ? formData.dataAdmissao.toISOString().split('T')[0]
                    : '',
                NecessidadeEspecial: formData.necessidadeEspecial ? '1' : '0',
                TipoNecessidadeEspecial: formData.tipoNecessidadeEspecial || '',
                Observacoes: formData.observacoes || '',
                Status: formData.status || 'ATIVO'
            };

            // Adicionar campos ao FormData
            Object.keys(mappedData).forEach((key) => {
                if (mappedData[key] !== null && mappedData[key] !== undefined) {
                    formDataToSend.append(key, mappedData[key]);
                }
            });

            // Adicionar arquivos
            if (formData.fotografia instanceof File) {
                formDataToSend.append('Fotografia', formData.fotografia);
            }
            if (formData.bilheteIdentidade instanceof File) {
                formDataToSend.append('BilheteIdentidade', formData.bilheteIdentidade);
            }
            if (formData.certificadoAcademico instanceof File) {
                formDataToSend.append('CertificadoAcademico', formData.certificadoAcademico);
            }
            if (formData.curriculo instanceof File) {
                formDataToSend.append('Curriculo', formData.curriculo);
            }
            if (formData.outrosDocumentos instanceof File) {
                formDataToSend.append('OutrosDocumentos', formData.outrosDocumentos);
            }

            // Simulação de envio para API
            console.log("📤 Dados do professor enviados para a API:");
            for (let pair of formDataToSend.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Simular sucesso após 2 segundos
            setTimeout(() => {
                setLoading(false);
                setFormData(initialState);
                showToast('success', 'Sucesso', 'Professor cadastrado com sucesso!');
                setActiveIndex(0);
                setUploadedFiles({
                    fotografia: null,
                    bilheteIdentidade: null,
                    certificadoAcademico: null,
                    curriculo: null,
                    outrosDocumentos: null
                });
            }, 2000);

        } catch (error) {
            setLoading(false);
            console.error('Erro ao cadastrar professor:', error);
            showToast('error', 'Erro', 'Erro ao cadastrar professor. Tente novamente.');
        }
    };

    // Verificar se todos os arquivos obrigatórios foram enviados
    const isAllRequiredFilesUploaded = () => {
        return uploadedFiles.fotografia && uploadedFiles.bilheteIdentidade && uploadedFiles.certificadoAcademico;
    };

    // Renderizar etapa de upload de documentos
    const renderDocumentUploadStep = () => (
        <div className="w-full mx-auto p-6">
            <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <p className="ml-3 text-sm text-blue-700 font-medium">
                        Fotografia, Bilhete de Identidade e Certificado Acadêmico são obrigatórios para o cadastro
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {/* Fotografia */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Fotografia *
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('fotografia', e.target.files[0])}
                            id="foto-upload"
                        />
                        <label
                            htmlFor="foto-upload"
                            className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 
                ${uploadedFiles.fotografia
                                    ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                        >
                            <User className={`w-10 h-10 mb-3 ${uploadedFiles.fotografia ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${uploadedFiles.fotografia ? 'text-blue-600' : 'text-gray-500'}`}>
                                {uploadedFiles.fotografia ? 'Foto carregada' : 'Adicionar foto'}
                            </p>
                            {uploadedFiles.fotografia && (
                                <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotografia.name}</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* Bilhete de Identidade */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Bilhete de Identidade *
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('bilheteIdentidade', e.target.files[0])}
                            id="bi-upload"
                        />
                        <label
                            htmlFor="bi-upload"
                            className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 
                ${uploadedFiles.bilheteIdentidade
                                    ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                        >
                            <IdCard className={`w-10 h-10 mb-3 ${uploadedFiles.bilheteIdentidade ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${uploadedFiles.bilheteIdentidade ? 'text-blue-600' : 'text-gray-500'}`}>
                                {uploadedFiles.bilheteIdentidade ? 'BI carregado' : 'Adicionar BI'}
                            </p>
                            {uploadedFiles.bilheteIdentidade && (
                                <p className="text-xs text-blue-500 mt-1">{uploadedFiles.bilheteIdentidade.name}</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* Certificado Acadêmico */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Certificado Acadêmico *
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload('certificadoAcademico', e.target.files[0])}
                            id="certificado-upload"
                        />
                        <label
                            htmlFor="certificado-upload"
                            className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 
                ${uploadedFiles.certificadoAcademico
                                    ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                        >
                            <Award className={`w-10 h-10 mb-3 ${uploadedFiles.certificadoAcademico ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${uploadedFiles.certificadoAcademico ? 'text-blue-600' : 'text-gray-500'}`}>
                                {uploadedFiles.certificadoAcademico ? 'Certificado carregado' : 'Adicionar certificado'}
                            </p>
                            {uploadedFiles.certificadoAcademico && (
                                <p className="text-xs text-blue-500 mt-1">{uploadedFiles.certificadoAcademico.name}</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* Currículo */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Currículo
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileUpload('curriculo', e.target.files[0])}
                            id="curriculo-upload"
                        />
                        <label
                            htmlFor="curriculo-upload"
                            className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 
                ${uploadedFiles.curriculo
                                    ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                        >
                            <FileText className={`w-10 h-10 mb-3 ${uploadedFiles.curriculo ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${uploadedFiles.curriculo ? 'text-blue-600' : 'text-gray-500'}`}>
                                {uploadedFiles.curriculo ? 'Currículo carregado' : 'Adicionar currículo'}
                            </p>
                            {uploadedFiles.curriculo && (
                                <p className="text-xs text-blue-500 mt-1">{uploadedFiles.curriculo.name}</p>
                            )}
                        </label>
                    </div>
                </div>

                {/* Outros Documentos */}
                <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">
                        Outros Documentos
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                            onChange={(e) => handleFileUpload('outrosDocumentos', e.target.files[0])}
                            id="outros-upload"
                        />
                        <label
                            htmlFor="outros-upload"
                            className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 
                ${uploadedFiles.outrosDocumentos
                                    ? 'bg-blue-50 border-blue-500 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-500 hover:bg-blue-50'}`}
                        >
                            <FileText className={`w-10 h-10 mb-3 ${uploadedFiles.outrosDocumentos ? 'text-blue-500' : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${uploadedFiles.outrosDocumentos ? 'text-blue-600' : 'text-gray-500'}`}>
                                {uploadedFiles.outrosDocumentos ? 'Documentos carregados' : 'Adicionar documentos'}
                            </p>
                            {uploadedFiles.outrosDocumentos && (
                                <p className="text-xs text-blue-500 mt-1">{uploadedFiles.outrosDocumentos.name}</p>
                            )}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );

    // Renderizar conteúdo das etapas
    const renderStepContent = (index) => {
        const age = calculateAge(formData.dataNascimento);

        const stepContents = {
            // Etapa 0: Identificação
            0: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CustomInput
                        type="text"
                        label="Nome Completo"
                        value={formData.nome}
                        onChange={(value) => handleInputChange('nome', value)}
                        required
                        errorMessage={errors.nome}
                        placeholder="Digite o nome completo"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="date"
                        label="Data de Nascimento"
                        value={formData.dataNascimento}
                        onChange={(value) => handleInputChange('dataNascimento', value)}
                        required
                        errorMessage={errors.dataNascimento}
                        placeholder="Selecione a data"
                        iconStart={<Calendar size={18} />}
                        helperText="Idade mínima: 18 anos"
                    />

                    <CustomInput
                        type="select"
                        label="Sexo"
                        value={formData.genero}
                        options={[
                            { label: 'Masculino', value: 'MASCULINO' },
                            { label: 'Feminino', value: 'FEMININO' }
                        ]}
                        onChange={(value) => handleInputChange('genero', value)}
                        required
                        errorMessage={errors.genero}
                        placeholder="Selecione o sexo"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Estado Civil"
                        value={formData.estadoCivil}
                        options={[
                            { label: 'Solteiro(a)', value: 'SOLTEIRO' },
                            { label: 'Casado(a)', value: 'CASADO' },
                            { label: 'Divorciado(a)', value: 'DIVORCIADO' },
                            { label: 'Viúvo(a)', value: 'VIUVO' }
                        ]}
                        onChange={(value) => handleInputChange('estadoCivil', value)}
                        errorMessage={errors.estadoCivil}
                        placeholder="Selecione o estado civil"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Naturalidade (País de Nascimento)"
                        value={formData.naturalidade}
                        options={loading ? [{ label: 'Carregando...', value: '' }] : countries}
                        onChange={(value) => handleInputChange('naturalidade', value)}
                        required
                        errorMessage={errors.naturalidade}
                        placeholder="Selecione o país de nascimento"
                        iconStart={<Globe size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Província de Nascimento"
                        value={formData.provinciaNascimento}
                        options={provinciasData.map(provincia => ({
                            label: provincia.nome,
                            value: provincia.nome
                        }))}
                        onChange={(value) => handleInputChange('provinciaNascimento', value)}
                        disabled={!formData.naturalidade?.value || formData.naturalidade?.value !== 'Angola'}
                        required={formData.naturalidade?.value === 'Angola'}
                        errorMessage={errors.provinciaNascimento}
                        placeholder="Selecione a província"
                        iconStart={<Map size={18} />}
                        helperText={formData.naturalidade?.value !== 'Angola' ? "Disponível apenas para nascidos em Angola" : ""}
                    />

                    <CustomInput
                        type="text"
                        label="Número do BI"
                        value={formData.numeroBI}
                        onChange={(value) => handleInputChange('numeroBI', value)}
                        required
                        errorMessage={errors.numeroBI}
                        placeholder="Digite o número do BI"
                        iconStart={<IdCard size={18} />}
                    />
                </div>
            ),

            // Etapa 1: Residência
            1: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CustomInput
                        type="select"
                        label="Província de Residência"
                        value={formData.provinciaResidencia}
                        options={provinciasData.map(provincia => ({
                            label: provincia.nome,
                            value: provincia.nome
                        }))}
                        onChange={(value) => handleInputChange('provinciaResidencia', value)}
                        required
                        errorMessage={errors.provinciaResidencia}
                        placeholder="Selecione a província"
                        iconStart={<MapPin size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Município"
                        value={formData.municipioResidencia}
                        options={municipiosOptions}
                        onChange={(value) => handleInputChange('municipioResidencia', value)}
                        required
                        errorMessage={errors.municipioResidencia}
                        placeholder="Selecione o município"
                        iconStart={<Map size={18} />}
                        helperText={!formData.provinciaResidencia ? "Selecione a província primeiro" : ""}
                        disabled={!formData.provinciaResidencia}
                    />

                    <CustomInput
                        type="text"
                        label="Bairro"
                        value={formData.bairro}
                        onChange={(value) => handleInputChange('bairro', value)}
                        required
                        errorMessage={errors.bairro}
                        placeholder="Digite o nome do bairro"
                        iconStart={<Home size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Casa No"
                        value={formData.endereco}
                        onChange={(value) => handleInputChange('endereco', value)}
                        placeholder="Número casa/quarteirão ou apartamento"
                        iconStart={<Home size={18} />}
                    />

                    <CustomInput
                        type="tel"
                        label="Telefone"
                        value={formData.telefone}
                        onChange={(value) => handleInputChange('telefone', value)}
                        required
                        errorMessage={errors.telefone}
                        placeholder="Ex: 923456789"
                        iconStart={<Phone size={18} />}
                    />

                    <CustomInput
                        type="tel"
                        label="Telefone Alternativo"
                        value={formData.telefoneAlternativo}
                        onChange={(value) => handleInputChange('telefoneAlternativo', value)}
                        placeholder="Ex: 923456789"
                        iconStart={<Phone size={18} />}
                    />

                    <CustomInput
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={(value) => handleInputChange('email', value)}
                        required
                        errorMessage={errors.email}
                        placeholder="exemplo@email.com"
                        iconStart={<Mail size={18} />}
                    />
                </div>
            ),

            // Etapa 2: Filiação
            2: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CustomInput
                        type="text"
                        label="Nome do Pai"
                        value={formData.nomePai}
                        onChange={(value) => handleInputChange('nomePai', value)}
                        required
                        errorMessage={errors.nomePai}
                        placeholder="Digite o nome completo do pai"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="tel"
                        label="Telefone do Pai"
                        value={formData.telefonePai}
                        onChange={(value) => handleInputChange('telefonePai', value)}
                        placeholder="Ex: 923456789"
                        iconStart={<Phone size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Profissão do Pai"
                        value={formData.profissaoPai}
                        onChange={(value) => handleInputChange('profissaoPai', value)}
                        placeholder="Digite a profissão"
                        iconStart={<Briefcase size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Nome da Mãe"
                        value={formData.nomeMae}
                        onChange={(value) => handleInputChange('nomeMae', value)}
                        required
                        errorMessage={errors.nomeMae}
                        placeholder="Digite o nome completo da mãe"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="tel"
                        label="Telefone da Mãe"
                        value={formData.telefoneMae}
                        onChange={(value) => handleInputChange('telefoneMae', value)}
                        placeholder="Ex: 923456789"
                        iconStart={<Phone size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Profissão da Mãe"
                        value={formData.profissaoMae}
                        onChange={(value) => handleInputChange('profissaoMae', value)}
                        placeholder="Digite a profissão"
                        iconStart={<Briefcase size={18} />}
                    />
                </div>
            ),

            // Etapa 3: Informações Profissionais
            3: (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CustomInput
                        type="select"
                        label="Subsistema de Ensino"
                        value={formData.subsistemaEnsino}
                        options={[
                            { label: 'Ensino Geral', value: 'GERAL' },
                            { label: 'Ensino Técnico-Profissional', value: 'TECNICO_PROFISSIONAL' }
                        ]}
                        onChange={(value) => handleInputChange('subsistemaEnsino', value)}
                        required
                        errorMessage={errors.subsistemaEnsino}
                        placeholder="Selecione o subsistema"
                        iconStart={<GraduationCap size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Instituição de Ensino"
                        value={formData.instituicaoEnsino}
                        options={escolasOptions}
                        onChange={(value) => handleInputChange('instituicaoEnsino', value)}
                        required
                        errorMessage={errors.instituicaoEnsino}
                        placeholder="Selecione a escola"
                        iconStart={<Building size={18} />}
                        helperText={!formData.provinciaResidencia ? "Selecione a província primeiro" : ""}
                        disabled={!formData.provinciaResidencia}
                    />

                    <CustomInput
                        type="select"
                        label="Grau Acadêmico"
                        value={formData.grauAcademico}
                        options={[
                            { label: 'Ensino Médio Técnico', value: 'MEDIO_TECNICO' },
                            { label: 'Bacharelado', value: 'BACHARELADO' },
                            { label: 'Licenciatura', value: 'LICENCIATURA' },
                            { label: 'Mestrado', value: 'MESTRADO' },
                            { label: 'Doutorado', value: 'DOUTORADO' }
                        ]}
                        onChange={(value) => handleInputChange('grauAcademico', value)}
                        required
                        errorMessage={errors.grauAcademico}
                        placeholder="Selecione o grau acadêmico"
                        iconStart={<Award size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Área de Especialização"
                        value={formData.especializacao}
                        onChange={(value) => handleInputChange('especializacao', value)}
                        required
                        errorMessage={errors.especializacao}
                        placeholder="Ex: Matemática, Português, Informática"
                        iconStart={<BookOpen size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Tempo de Experiência"
                        value={formData.tempoExperiencia}
                        options={[
                            { label: 'Menos de 1 ano', value: '0-1' },
                            { label: '1-3 anos', value: '1-3' },
                            { label: '3-5 anos', value: '3-5' },
                            { label: '5-10 anos', value: '5-10' },
                            { label: 'Mais de 10 anos', value: '10+' }
                        ]}
                        onChange={(value) => handleInputChange('tempoExperiencia', value)}
                        placeholder="Selecione a experiência"
                        iconStart={<Clock size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Situação Contratual"
                        value={formData.situacaoContratual}
                        options={[
                            { label: 'Efetivo', value: 'EFETIVO' },
                            { label: 'Contratado', value: 'CONTRATADO' },
                            { label: 'Estagiário', value: 'ESTAGIARIO' },
                            { label: 'Substituto', value: 'SUBSTITUTO' }
                        ]}
                        onChange={(value) => handleInputChange('situacaoContratual', value)}
                        placeholder="Selecione a situação"
                        iconStart={<Briefcase size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Número de Agente"
                        value={formData.numeroAgente}
                        onChange={(value) => handleInputChange('numeroAgente', value)}
                        placeholder="Digite o número de agente"
                        iconStart={<IdCard size={18} />}
                    />

                    <CustomInput
                        type="number"
                        label="Salário (Kz)"
                        value={formData.salario}
                        onChange={(value) => handleInputChange('salario', value)}
                        placeholder="Ex: 150000"
                        iconStart={<span className="text-gray-400">Kz</span>}
                    />

                    <CustomInput
                        type="date"
                        label="Data de Admissão"
                        value={formData.dataAdmissao}
                        onChange={(value) => handleInputChange('dataAdmissao', value)}
                        placeholder="Selecione a data"
                        iconStart={<Calendar size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Tem Necessidades Especiais?"
                        value={formData.necessidadeEspecial}
                        options={[
                            { label: 'Sim', value: true },
                            { label: 'Não', value: false }
                        ]}
                        onChange={(value) => handleInputChange('necessidadeEspecial', value)}
                        placeholder="Selecione uma opção"
                        iconStart={<User size={18} />}
                    />

                    {formData.necessidadeEspecial && (
                        <div className="col-span-full">
                            <CustomInput
                                type="text"
                                label="Tipo de Necessidade Especial"
                                value={formData.tipoNecessidadeEspecial}
                                onChange={(value) => handleInputChange('tipoNecessidadeEspecial', value)}
                                placeholder="Descreva a necessidade especial"
                                iconStart={<User size={18} />}
                            />
                        </div>
                    )}

                    <div className="col-span-full">
                        <CustomInput
                            type="textarea"
                            label="Observações"
                            value={formData.observacoes}
                            onChange={(value) => handleInputChange('observacoes', value)}
                            placeholder="Informações adicionais sobre o professor, disciplinas específicas, horários preferenciais, etc..."
                            rows={4}
                            maxLength={500}
                        />
                    </div>
                </div>
            ),

            // Etapa 4: Documentos
            4: renderDocumentUploadStep()
        };

        return stepContents[index] || <p>Conteúdo em desenvolvimento...</p>;
    };

    // Verificar se é a última etapa
    const isLastStep = activeIndex === steps.length - 1;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        toastMessage.severity === 'warn' ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' :
                            'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {toastMessage.severity === 'success' && <CheckCircle size={20} />}
                            {toastMessage.severity === 'error' && <AlertCircle size={20} />}
                            {toastMessage.severity === 'warn' && <AlertCircle size={20} />}
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-6 p-6 border-b border-gray-100">
                        <h1 className="text-3xl font-bold mb-2 text-blue-800">Sistema de Cadastro de Professores</h1>
                        <p className="text-gray-600">Subsistemas de Ensino Geral e Técnico-Profissional - Angola</p>
                        <p className="text-sm text-gray-500 mt-1">Preencha todos os campos obrigatórios (*)</p>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-between items-center px-6 mb-6">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all ${index > activeIndex ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => index <= activeIndex && setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${index < activeIndex ? 'bg-green-500 text-white' :
                                        index === activeIndex ? 'bg-blue-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index < activeIndex ? (
                                            <Check size={20} />
                                        ) : (
                                            <StepIcon size={20} />
                                        )}
                                    </div>
                                    <span className={`text-sm ${index === activeIndex ? 'font-semibold text-blue-700' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 mb-6 mx-6" style={{ width: 'calc(100% - 3rem)' }}>
                        <div
                            className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Content */}
                    <div className="step-content p-6 bg-white">
                        {renderStepContent(activeIndex)}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center p-6 pt-4 border-t border-gray-100">
                        <button
                            className={`px-6 py-3 rounded-lg border border-gray-300 flex items-center transition-colors ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:bg-gray-50 text-gray-700'
                                }`}
                            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={activeIndex === 0}
                        >
                            <ChevronLeft size={18} className="mr-2" />
                            Anterior
                        </button>

                        {/* Progress indicator */}
                        <div className="text-sm text-gray-500">
                            Etapa {activeIndex + 1} de {steps.length}
                        </div>

                        <button
                            className={`px-6 py-3 rounded-lg flex items-center transition-colors ${isLastStep
                                ? isAllRequiredFilesUploaded()
                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                    : 'bg-gray-300 cursor-not-allowed text-gray-600'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            disabled={(isLastStep && !isAllRequiredFilesUploaded()) || loading}
                            onClick={(e) => {
                                e.preventDefault();
                                if (!isLastStep) {
                                    if (validateCurrentStep()) {
                                        setActiveIndex(prev => prev + 1);
                                    } else {
                                        showToast('warn', 'Atenção', 'Por favor, preencha todos os campos obrigatórios.');
                                    }
                                } else {
                                    if (isAllRequiredFilesUploaded() && validateCurrentStep()) {
                                        handleSubmit(e);
                                    } else {
                                        showToast('error', 'Erro', 'Por favor, complete todos os campos e anexe os documentos necessários.');
                                    }
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader size={18} className="animate-spin mr-2" />
                                    Processando...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <Check size={18} className="mr-2" />
                                    Cadastrar Professor
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Próximo</span>
                                    <ChevronRight size={18} />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Information Card */}
                <div className="mt-6 bg-white p-6 shadow-sm rounded-lg border border-gray-200">
                    <div className="flex items-center text-blue-700 mb-3">
                        <Info size={18} className="mr-2" />
                        <h3 className="text-lg font-semibold">Informações do Sistema Educativo para Professores</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Subsistema de Ensino Geral:</h4>
                            <ul className="space-y-1">
                                <li>• Ensino Primário: Professores generalistas (1ª à 6ª classe)</li>
                                <li>• 1º Ciclo Secundário: Professores por disciplina (7ª à 9ª classe)</li>
                                <li>• 2º Ciclo Secundário: Professores especializados (10ª à 12ª classe)</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-800 mb-2">Subsistema Técnico-Profissional:</h4>
                            <ul className="space-y-1">
                                <li>• Professores de disciplinas técnicas específicas</li>
                                <li>• Formadores profissionais com experiência prática</li>
                                <li>• Orientadores de estágio e práticas</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-blue-700 text-sm">
                            <strong>Requisitos Mínimos:</strong> Para lecionar no ensino geral é necessário pelo menos
                            licenciatura na área específica. Para o ensino técnico-profissional, experiência prática
                            comprovada na área pode ser considerada.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CadastrarProfessor;