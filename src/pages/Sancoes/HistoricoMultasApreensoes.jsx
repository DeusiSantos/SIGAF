import React, { useEffect, useState } from 'react';
import {
    User,
    Building,
    Trees,
    FileText,
    Check,
    ChevronRight,
    ChevronLeft,
    Calendar,
    MapPin,
    AlertCircle,
    CheckCircle,
    Info,
    Loader,
    CreditCard,
    Phone,
    Search,
    Plus,
    Trash2,
    Award,
    Eye,
    Upload,
    DollarSign,
    Scale,
    Camera,
    UserCheck,
    Download,
} from 'lucide-react';

// IMPORTAR A FUNÇÃO DE GERAÇÃO DO PDF
import { gerarAutoInfracao } from '../public/CertificadoMultaGenerator';

const CustomInput = ({ type, label, value, onChange, options, required, errorMessage, disabled, placeholder, iconStart, helperText, rows, ...props }) => {
    const baseInputClasses = `w-full p-3 border rounded-xl transition-all ${errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-green-200`;

    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <select
                        className={baseInputClasses}
                        value={typeof value === 'object' ? value?.value || '' : value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disabled}
                        {...props}
                    >
                        <option value="">{placeholder || 'Selecione...'}</option>
                        {options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case 'textarea':
                return (
                    <textarea
                        className={baseInputClasses}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows || 3}
                        {...props}
                    />
                );
            case 'file':
                return (
                    <input
                        type="file"
                        className={baseInputClasses}
                        onChange={(e) => onChange(e.target.files[0])}
                        disabled={disabled}
                        accept="image/*,.pdf,.doc,.docx"
                        {...props}
                    />
                );
            default:
                return (
                    <input
                        type={type}
                        className={baseInputClasses}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        {...props}
                    />
                );
        }
    };

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {iconStart && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        {iconStart}
                    </div>
                )}
                <div className={iconStart ? 'pl-10' : ''}>
                    {renderInput()}
                </div>
            </div>
            {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
            {errorMessage && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {errorMessage}
                </p>
            )}
        </div>
    );
};

const HistoricoMultasApreensoes = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const [produtorSelecionado, setProdutorSelecionado] = useState(null);
    const [modoBusca, setModoBusca] = useState(true);

    // Estados para as propriedades/florestas do produtor
    const [propriedades, setPropriedades] = useState([]);
    const [propriedadeSelecionada, setPropriedadeSelecionada] = useState(null);

    // NOVO: Estado para controlar se o PDF foi gerado
    const [pdfGerado, setPdfGerado] = useState(false);
    const [dadosRegistroCompleto, setDadosRegistroCompleto] = useState(null);

    // Estado inicial do formulário
    const initialState = {
        // Dados do produtor/empresa
        nomeCompleto: '',
        nomeEmpresa: '',
        bi: '',
        telefone: '',
        provincia: '',
        municipio: '',

        // Dados da sanção
        tipoSancao: '',
        valorMulta: '',
        motivoSancao: '',
        descricaoDetalhada: '',
        dataOcorrencia: '',
        localOcorrencia: '',
        documentosComprovativo: null,

        // Dados do responsável
        nomeResponsavel: '',
        cargoResponsavel: '',
        instituicaoResponsavel: '',
        dataAplicacao: new Date().toISOString().split('T')[0],
        observacoes: '',
        numeroProcesso: Math.floor(100000 + Math.random() * 900000)
    };

    const [formData, setFormData] = useState(initialState);

    // Dados mock de produtores existentes
    const produtoresMock = [
        {
            id: 1,
            nome: 'João Silva Santos',
            bi: '123456789LA041',
            telefone: '923456789',
            provincia: 'LUANDA',
            municipio: 'LUANDA',
            tipo: 'PESSOA_FISICA'
        },
        {
            id: 2,
            nome: 'Empresa Florestal Lda',
            bi: '987654321LA042',
            telefone: '924567890',
            provincia: 'BENGUELA',
            municipio: 'BENGUELA',
            tipo: 'EMPRESA'
        }
    ];

    // Dados mock de propriedades florestais
    const propriedadesMock = {
        1: [
            { id: 1, nome: 'Floresta do Norte', area: '150 ha', localizacao: 'Luanda - Cacuaco', coordenadas: '-8.7832, 13.3432' },
            { id: 2, nome: 'Área Verde Sul', area: '200 ha', localizacao: 'Luanda - Viana', coordenadas: '-8.9167, 13.3667' }
        ],
        2: [
            { id: 3, nome: 'Concessão Benguela', area: '500 ha', localizacao: 'Benguela - Lobito', coordenadas: '-12.3532, 13.5356' }
        ]
    };

    const steps = [
        { label: 'Identificação', icon: Search },
        { label: 'Dados do Infrator', icon: User },
        { label: 'Propriedade/Floresta', icon: Trees },
        { label: 'Sanção Aplicada', icon: Scale },
        { label: 'Responsável', icon: UserCheck }
    ];

    const showToast = (severity, summary, detail, duration = 3000) => {
        setToastMessage({ severity, summary, detail, visible: true });
        setTimeout(() => setToastMessage(null), duration);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const buscarProdutor = (produtorId) => {
        const produtor = produtoresMock.find(p => p.id === parseInt(produtorId));
        if (produtor) {
            setProdutorSelecionado(produtor);
            setFormData(prev => ({
                ...prev,
                nomeCompleto: produtor.tipo === 'PESSOA_FISICA' ? produtor.nome : '',
                nomeEmpresa: produtor.tipo === 'EMPRESA' ? produtor.nome : '',
                bi: produtor.bi,
                telefone: produtor.telefone,
                provincia: produtor.provincia,
                municipio: produtor.municipio
            }));

            // Carregar propriedades do produtor
            setPropriedades(propriedadesMock[produtor.id] || []);
            setPropriedadeSelecionada(null);

            showToast('success', 'Produtor Encontrado', 'Dados preenchidos automaticamente!');
        }
    };

    const validateCurrentStep = () => {
        const newErrors = {};

        switch (activeIndex) {
            case 0: // Identificação
                if (modoBusca && !produtorSelecionado) {
                    newErrors.produtorSelecionado = 'Selecione um produtor existente';
                } else if (!modoBusca) {
                    if (!formData.nomeCompleto && !formData.nomeEmpresa) {
                        newErrors.nome = 'Nome completo ou nome da empresa é obrigatório';
                    }
                    if (!formData.bi) {
                        newErrors.bi = 'Campo obrigatório';
                    }
                }
                break;

            case 1: // Dados do Infrator
                if (!formData.telefone) {
                    newErrors.telefone = 'Campo obrigatório';
                }
                if (!formData.provincia) {
                    newErrors.provincia = 'Campo obrigatório';
                }
                break;

            case 2: // Propriedade/Floresta
                if (!propriedadeSelecionada) {
                    newErrors.propriedade = 'Selecione uma propriedade/floresta';
                }
                break;

            case 3: // Sanção Aplicada
                if (!formData.tipoSancao) {
                    newErrors.tipoSancao = 'Campo obrigatório';
                }
                if (formData.tipoSancao === 'MULTA' && !formData.valorMulta) {
                    newErrors.valorMulta = 'Valor da multa é obrigatório';
                }
                if (!formData.motivoSancao) {
                    newErrors.motivoSancao = 'Campo obrigatório';
                }
                if (!formData.dataOcorrencia) {
                    newErrors.dataOcorrencia = 'Campo obrigatório';
                }
                break;

            case 4: // Responsável
                if (!formData.nomeResponsavel) {
                    newErrors.nomeResponsavel = 'Campo obrigatório';
                }
                if (!formData.cargoResponsavel) {
                    newErrors.cargoResponsavel = 'Campo obrigatório';
                }
                if (!formData.instituicaoResponsavel) {
                    newErrors.instituicaoResponsavel = 'Campo obrigatório';
                }
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // NOVA FUNÇÃO: Gerar PDF após registro bem-sucedido
    const gerarPDFAuto = async (dadosCompletos) => {
        try {
            console.log('Gerando Auto de Infração em PDF...', dadosCompletos);
            
            // Chamar a função de geração do PDF
            const resultado = await gerarAutoInfracao(dadosCompletos.formData, dadosCompletos.propriedadeSelecionada);
            
            if (resultado.success) {
                setPdfGerado(true);
                showToast('success', 'PDF Gerado', 'Auto de Infração foi baixado automaticamente!');
            }
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            showToast('error', 'Erro no PDF', 'Erro ao gerar o Auto de Infração em PDF.');
        }
    };

    // NOVA FUNÇÃO: Baixar PDF novamente
    const baixarPDFNovamente = async () => {
        if (dadosRegistroCompleto) {
            setLoading(true);
            try {
                await gerarAutoInfracao(dadosRegistroCompleto.formData, dadosRegistroCompleto.propriedadeSelecionada);
                showToast('success', 'PDF Baixado', 'Auto de Infração baixado novamente!');
            } catch (error) {
                showToast('error', 'Erro', 'Erro ao baixar o PDF novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Identificação
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Search className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Infrator</h3>
                            </div>
                            <p className="text-gray-600">
                                Identifique o produtor ou empresa que cometeu a infração florestal.
                            </p>
                        </div>

                        {errors.produtorSelecionado && (
                            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <p className="text-red-700 text-sm font-medium">
                                        {errors.produtorSelecionado}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <button
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${modoBusca
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    onClick={() => {
                                        setModoBusca(true);
                                        setProdutorSelecionado(null);
                                        setFormData(initialState);
                                        setErrors({});
                                    }}
                                >
                                    <Search size={18} className="mr-2 inline" />
                                    Buscar Existente
                                </button>
                                <button
                                    className={`px-6 py-3 rounded-xl font-medium transition-all ${!modoBusca
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    onClick={() => {
                                        setModoBusca(false);
                                        setProdutorSelecionado(null);
                                        setFormData(initialState);
                                        setErrors({});
                                    }}
                                >
                                    <Plus size={18} className="mr-2 inline" />
                                    Novo Registro
                                </button>
                            </div>

                            {modoBusca ? (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Buscar Produtor ou Empresa</h4>

                                    <CustomInput
                                        type="select"
                                        label="Selecionar Produtor ou Empresa"
                                        value=""
                                        options={produtoresMock.map(p => ({
                                            label: `${p.nome} - ${p.bi}`,
                                            value: p.id.toString()
                                        }))}
                                        onChange={(value) => buscarProdutor(value)}
                                        placeholder="Selecione um produtor existente"
                                        iconStart={<Search size={18} />}
                                        errorMessage={errors.produtorSelecionado}
                                    />

                                    {produtorSelecionado && (
                                        <div className="mt-6 p-6 bg-red-50 rounded-xl border border-red-200">
                                            <div className="flex items-center mb-3">
                                                <CheckCircle className="w-5 h-5 text-red-600 mr-2" />
                                                <h5 className="font-semibold text-red-800">Infrator Selecionado</h5>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                <div><strong>Nome:</strong> {produtorSelecionado.nome}</div>
                                                <div><strong>Documento:</strong> {produtorSelecionado.bi}</div>
                                                <div><strong>Telefone:</strong> {produtorSelecionado.telefone}</div>
                                                <div><strong>Tipo:</strong> {produtorSelecionado.tipo === 'EMPRESA' ? 'Empresa' : 'Pessoa Física'}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Novo Infrator</h4>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomInput
                                            type="text"
                                            label="Nome Completo / Empresa"
                                            value={formData.nomeCompleto || formData.nomeEmpresa}
                                            onChange={(value) => handleInputChange('nomeCompleto', value)}
                                            required
                                            errorMessage={errors.nome}
                                            placeholder="Digite o nome completo ou da empresa"
                                            iconStart={<User size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Número do Documento"
                                            value={formData.bi}
                                            onChange={(value) => handleInputChange('bi', value)}
                                            required
                                            errorMessage={errors.bi}
                                            placeholder="BI, NIF ou outro documento"
                                            iconStart={<CreditCard size={18} />}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 1: // Dados do Infrator
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Dados do Infrator</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações de contacto e localização do infrator.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome / Empresa"
                                    value={formData.nomeCompleto || formData.nomeEmpresa}
                                    onChange={(value) => handleInputChange(formData.nomeCompleto ? 'nomeCompleto' : 'nomeEmpresa', value)}
                                    disabled={produtorSelecionado !== null}
                                    iconStart={<User size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Documento de Identificação"
                                    value={formData.bi}
                                    onChange={(value) => handleInputChange('bi', value)}
                                    disabled={produtorSelecionado !== null}
                                    iconStart={<CreditCard size={18} />}
                                />

                                <CustomInput
                                    type="tel"
                                    label="Contacto Telefónico"
                                    value={formData.telefone}
                                    onChange={(value) => handleInputChange('telefone', value)}
                                    required
                                    errorMessage={errors.telefone}
                                    placeholder="Ex: 923456789"
                                    iconStart={<Phone size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Província"
                                    value={formData.provincia}
                                    options={[
                                        { label: 'Luanda', value: 'LUANDA' },
                                        { label: 'Benguela', value: 'BENGUELA' },
                                        { label: 'Huíla', value: 'HUILA' },
                                        { label: 'Cuando Cubango', value: 'CUANDO_CUBANGO' }
                                    ]}
                                    onChange={(value) => handleInputChange('provincia', value)}
                                    required
                                    errorMessage={errors.provincia}
                                    iconStart={<MapPin size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Município"
                                    value={formData.municipio}
                                    onChange={(value) => handleInputChange('municipio', value)}
                                    iconStart={<Building size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Propriedade/Floresta
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Trees className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Propriedade/Floresta Afetada</h3>
                            </div>
                            <p className="text-gray-600">
                                Selecione a propriedade ou área florestal onde ocorreu a infração.
                            </p>
                        </div>

                        {errors.propriedade && (
                            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                <div className="flex items-center">
                                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                                    <p className="text-red-700 text-sm font-medium">
                                        {errors.propriedade}
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            {propriedades.length > 0 ? (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Propriedades/Florestas Disponíveis</h4>

                                    <div className="grid grid-cols-1 gap-4">
                                        {propriedades.map((prop) => (
                                            <div
                                                key={prop.id}
                                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${propriedadeSelecionada?.id === prop.id
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-green-300'
                                                    }`}
                                                onClick={() => setPropriedadeSelecionada(prop)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800">{prop.nome}</h5>
                                                        <p className="text-sm text-gray-600">Área: {prop.area}</p>
                                                        <p className="text-sm text-gray-600">Localização: {prop.localizacao}</p>
                                                        <p className="text-xs text-gray-500">Coordenadas: {prop.coordenadas}</p>
                                                    </div>
                                                    <div className="ml-4">
                                                        {propriedadeSelecionada?.id === prop.id && (
                                                            <CheckCircle className="w-6 h-6 text-green-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Trees size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">Nenhuma propriedade encontrada</p>
                                    <p className="text-sm">Selecione primeiro um produtor na etapa de identificação</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 3: // Sanção Aplicada
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Scale className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Sanção Aplicada</h3>
                            </div>
                            <p className="text-gray-600">
                                Registre os detalhes da sanção aplicada pela infração cometida.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                            {/* Tipo de Sanção e Valor */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <CustomInput
                                    type="select"
                                    label="Tipo de Sanção"
                                    value={formData.tipoSancao}
                                    options={[
                                        { label: 'Multa', value: 'MULTA' },
                                        { label: 'Apreensão de Equipamentos', value: 'APREENSAO_EQUIPAMENTOS' },
                                        { label: 'Apreensão de Madeira', value: 'APREENSAO_MADEIRA' },
                                        { label: 'Suspensão de Atividade', value: 'SUSPENSAO_ATIVIDADE' },
                                        { label: 'Embargamento de Obra', value: 'EMBARGAMENTO_OBRA' }
                                    ]}
                                    onChange={(value) => handleInputChange('tipoSancao', value)}
                                    required
                                    errorMessage={errors.tipoSancao}
                                    iconStart={<Scale size={18} />}
                                />

                                {formData.tipoSancao === 'MULTA' && (
                                    <CustomInput
                                        type="number"
                                        label="Valor da Multa (AOA)"
                                        value={formData.valorMulta}
                                        onChange={(value) => handleInputChange('valorMulta', value)}
                                        required
                                        errorMessage={errors.valorMulta}
                                        placeholder="0.00"
                                        iconStart={<DollarSign size={18} />}
                                    />
                                )}

                                <CustomInput
                                    type="select"
                                    label="Motivo da Sanção"
                                    value={formData.motivoSancao}
                                    options={[
                                        { label: 'Desmatamento ilegal', value: 'DESMATAMENTO_ILEGAL' },
                                        { label: 'Exploração sem licença', value: 'EXPLORACAO_SEM_LICENCA' },
                                        { label: 'Queimadas não autorizadas', value: 'QUEIMADAS_NAO_AUTORIZADAS' },
                                        { label: 'Transporte ilegal de madeira', value: 'TRANSPORTE_ILEGAL_MADEIRA' },
                                        { label: 'Violação de área protegida', value: 'VIOLACAO_AREA_PROTEGIDA' },
                                        { label: 'Outros', value: 'OUTROS' }
                                    ]}
                                    onChange={(value) => handleInputChange('motivoSancao', value)}
                                    required
                                    errorMessage={errors.motivoSancao}
                                    iconStart={<FileText size={18} />}
                                />

                                <CustomInput
                                    type="date"
                                    label="Data da Ocorrência"
                                    value={formData.dataOcorrencia}
                                    onChange={(value) => handleInputChange('dataOcorrencia', value)}
                                    required
                                    errorMessage={errors.dataOcorrencia}
                                    iconStart={<Calendar size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Local da Ocorrência"
                                    value={formData.localOcorrencia}
                                    onChange={(value) => handleInputChange('localOcorrencia', value)}
                                    placeholder="Descreva o local específico"
                                    iconStart={<MapPin size={18} />}
                                />
                            </div>

                            {/* Descrição Detalhada */}
                            <CustomInput
                                type="textarea"
                                label="Descrição Detalhada da Infração"
                                value={formData.descricaoDetalhada}
                                onChange={(value) => handleInputChange('descricaoDetalhada', value)}
                                placeholder="Descreva detalhadamente a infração cometida..."
                                rows={4}
                            />

                            {/* Upload de Documentos */}
                            <CustomInput
                                type="file"
                                label="Documentos Comprovativos"
                                onChange={(file) => handleInputChange('documentosComprovativo', file)}
                                iconStart={<Upload size={18} />}
                                helperText="Fotos, relatórios, autos de apreensão, etc. (máx. 5MB)"
                            />

                            {formData.documentosComprovativo && (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <span className="text-green-800 font-medium">
                                            Arquivo selecionado: {formData.documentosComprovativo.name}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4: // Responsável
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <UserCheck className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Responsável pela Aplicação da Sanção</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações do técnico/autoridade responsável pela aplicação da sanção.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                            {/* Dados do Responsável */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome do Responsável"
                                    value={formData.nomeResponsavel}
                                    onChange={(value) => handleInputChange('nomeResponsavel', value)}
                                    required
                                    errorMessage={errors.nomeResponsavel}
                                    placeholder="Nome completo do técnico"
                                    iconStart={<User size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Cargo"
                                    value={formData.cargoResponsavel}
                                    onChange={(value) => handleInputChange('cargoResponsavel', value)}
                                    required
                                    errorMessage={errors.cargoResponsavel}
                                    placeholder="Ex: Fiscal Florestal, Técnico Superior"
                                    iconStart={<Award size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Instituição"
                                    value={formData.instituicaoResponsavel}
                                    options={[
                                        { label: 'Direcção Nacional de Florestas (DNF)', value: 'DNF' },
                                        { label: 'Ministério da Agricultura e Florestas', value: 'MINAGRIF' },
                                        { label: 'Administração Municipal', value: 'ADMIN_MUNICIPAL' },
                                        { label: 'Polícia Nacional', value: 'POLICIA_NACIONAL' },
                                        { label: 'Outros', value: 'OUTROS' }
                                    ]}
                                    onChange={(value) => handleInputChange('instituicaoResponsavel', value)}
                                    required
                                    errorMessage={errors.instituicaoResponsavel}
                                    iconStart={<Building size={18} />}
                                />

                                <CustomInput
                                    type="date"
                                    label="Data da Aplicação da Sanção"
                                    value={formData.dataAplicacao}
                                    onChange={(value) => handleInputChange('dataAplicacao', value)}
                                    iconStart={<Calendar size={18} />}
                                />
                            </div>

                            {/* Observações */}
                            <CustomInput
                                type="textarea"
                                label="Observações Adicionais"
                                value={formData.observacoes}
                                onChange={(value) => handleInputChange('observacoes', value)}
                                placeholder="Observações sobre a aplicação da sanção, prazos, condições especiais..."
                                rows={4}
                            />

                            {/* Resumo Final */}
                            <div className="bg-gray-50 rounded-xl p-6 border">
                                <h5 className="font-semibold text-gray-800 mb-4">Resumo do Registro</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div><strong>Infrator:</strong> {formData.nomeCompleto || formData.nomeEmpresa || 'Não informado'}</div>
                                    <div><strong>Propriedade:</strong> {propriedadeSelecionada?.nome || 'Não selecionada'}</div>
                                    <div><strong>Tipo de Sanção:</strong> {formData.tipoSancao || 'Não informado'}</div>
                                    <div><strong>Valor da Multa:</strong> {formData.valorMulta ? `${formData.valorMulta} AOA` : 'N/A'}</div>
                                    <div><strong>Data da Ocorrência:</strong> {formData.dataOcorrencia || 'Não informado'}</div>
                                    <div><strong>Responsável:</strong> {formData.nomeResponsavel || 'Não informado'}</div>
                                    <div><strong>Nº do Processo:</strong> {formData.numeroProcesso}</div>
                                </div>
                            </div>

                            {/* NOVO: Seção de confirmação para geração do PDF */}
                            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                                <div className="flex items-center mb-3">
                                    <FileText className="w-5 h-5 text-red-600 mr-2" />
                                    <h5 className="font-semibold text-red-800">Geração Automática do Auto de Infração</h5>
                                </div>
                                <p className="text-red-700 text-sm mb-3">
                                    Após finalizar o registro, será gerado automaticamente um PDF oficial do Auto de Infração e Multa 
                                    com QR Code para verificação digital.
                                </p>
                                <div className="flex items-center text-sm text-red-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span>Documento oficial com validade legal</span>
                                </div>
                                <div className="flex items-center text-sm text-red-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span>QR Code para verificação online</span>
                                </div>
                                <div className="flex items-center text-sm text-red-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    <span>Download automático após registro</span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="text-center text-gray-500">Etapa não encontrada</div>;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            if (!validateCurrentStep()) {
                setLoading(false);
                showToast('error', 'Validação', 'Por favor, corrija os erros antes de finalizar o registro.');
                return;
            }

            // Simulação de envio de dados
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("📄 Registro de multa/apreensão:", {
                dadosInfrator: {
                    ...formData,
                    produtorSelecionado,
                    propriedadeSelecionada
                }
            });

            // NOVO: Preparar dados para PDF e gerar automaticamente
            const dadosCompletos = {
                formData,
                propriedadeSelecionada,
                produtorSelecionado
            };

            setDadosRegistroCompleto(dadosCompletos);
            
            setLoading(false);
            showToast('success', 'Sucesso', 'Registro de multa/apreensão concluído com sucesso!');

            // NOVO: Gerar PDF automaticamente após 1 segundo
            setTimeout(async () => {
                await gerarPDFAuto(dadosCompletos);
            }, 1000);

        } catch (error) {
            setLoading(false);
            console.error('Erro ao registrar multa/apreensão:', error);
            showToast('error', 'Erro', `Erro ao processar registro: ${error.message}`);
        }
    };

    const isLastStep = activeIndex === steps.length - 1;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
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

            {/* NOVO: Banner de sucesso e PDF gerado */}
            {pdfGerado && dadosRegistroCompleto && (
                <div className="fixed top-20 right-4 p-6 bg-white rounded-lg shadow-xl z-50 border-l-4 border-green-500 max-w-md">
                    <div className="flex items-center mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                        <h4 className="font-bold text-green-800">Auto de Infração Gerado!</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                        O Auto de Infração foi baixado automaticamente. Se não baixou, clique no botão abaixo.
                    </p>
                    <button
                        onClick={baixarPDFNovamente}
                        disabled={loading}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader size={16} className="animate-spin mr-2" />
                        ) : (
                            <Download size={16} className="mr-2" />
                        )}
                        Baixar PDF Novamente
                    </button>
                </div>
            )}

            <div className="">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
                        <h1 className="text-4xl font-bold mb-3 text-gray-800">Sistema de Multas e Apreensões</h1>
                        <p className="text-gray-600">Registro de sanções por infrações</p>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeIndex ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => index <= activeIndex && setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index < activeIndex ? 'bg-red-500 text-white' :
                                        index === activeIndex ? 'bg-red-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index < activeIndex ? (
                                            <Check size={24} />
                                        ) : (
                                            <StepIcon size={24} />
                                        )}
                                    </div>
                                    <span className={`text-sm text-center font-medium ${index === activeIndex ? 'text-red-700' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                        <div
                            className="bg-red-600 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Content */}
                    <div className="step-content p-8 bg-white min-h-[600px]">
                        {renderStepContent(activeIndex)}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
                        <button
                            className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                                }`}
                            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={activeIndex === 0}
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            Anterior
                        </button>

                        <div className="text-sm text-gray-500 font-medium">
                            Etapa {activeIndex + 1} de {steps.length}
                        </div>

                        <button
                            className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                                ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                                }`}
                            disabled={loading}
                            onClick={(e) => {
                                e.preventDefault();
                                if (!isLastStep) {
                                    if (validateCurrentStep()) {
                                        setTimeout(() => {
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }, 100);
                                        setActiveIndex(prev => prev + 1);
                                    } else {
                                        showToast('error', 'Validação', 'Por favor, corrija os erros antes de continuar.');
                                    }
                                } else {
                                    if (validateCurrentStep()) {
                                        handleSubmit(e);
                                    } else {
                                        showToast('error', 'Validação', 'Por favor, corrija os erros antes de finalizar.');
                                    }
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Processando...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <FileText size={20} className="mr-2" />
                                    Finalizar e Gerar PDF
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Próximo</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricoMultasApreensoes;