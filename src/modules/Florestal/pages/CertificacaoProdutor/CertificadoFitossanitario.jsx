// CertificadoFitossanitario.jsx
import axios from 'axios';
import {
    AlertCircle,
    BadgeCheck,
    Calendar,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    FileText,
    Info,
    Leaf,
    Loader,
    MapPin,
    Package,
    Ship,
    Truck,
    User
} from 'lucide-react';
import { useState } from 'react';
import CustomInput from '../../../../core/components/CustomInput';
import { gerarCertificadoFitossanitario } from './CertificadoFitossanitarioDocument';


const CertificadoFitossanitario = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    // Estado do formulário
    const [formData, setFormData] = useState({
        // Inspeção
        localInspecao: '',
        nomeFuncionarioAutorizado: '',
        dataEmissao: new Date().toISOString().split('T')[0],

        // Mercadoria
        naturezaMercadoria: '',
        nomeBotanico: '',
        origem: '',

        // Volumes
        quantidadeVolumes: '',
        naturezaVolumes: '',
        pesoVolumes: '',
        marcasNumeros: '',

        // Exportador
        nomeExportador: '',
        enderecoExportador: '',

        // Destinatário
        nomeDestinatario: '',
        enderecoDestinatario: '',

        // Transporte
        pontoEntrada: '',
        meioTransporte: '',
        portoEntrada: '',

        // Pagamento
        valorSelo: '',

        // Observações adicionais
        observacoes: '',
        declaracaoDesinfeccao: false,
        tratamentoAplicado: '',
    });

    const steps = [
        { label: 'Dados de Inspeção', icon: BadgeCheck },
        { label: 'Dados da Mercadoria', icon: Package },
        { label: 'Exportador e Destinatário', icon: User },
        { label: 'Transporte e Logística', icon: Truck },
        { label: 'Revisão Final', icon: CheckCircle }
    ];

    const meiosTransporteOptions = [
        { label: 'Marítimo', value: 'MARITIMO' },
        { label: 'Aéreo', value: 'AEREO' },
        { label: 'Rodoviário', value: 'RODOVIARIO' },
        { label: 'Ferroviário', value: 'FERROVIARIO' }
    ];

    const naturezaVolumesOptions = [
        { label: 'Caixas', value: 'CAIXAS' },
        { label: 'Sacos', value: 'SACOS' },
        { label: 'Paletes', value: 'PALETES' },
        { label: 'Containers', value: 'CONTAINERS' },
        { label: 'Granel', value: 'GRANEL' },
        { label: 'Outro', value: 'OUTRO' }
    ];

    const showToast = (severity, summary, detail) => {
        setToastMessage({ severity, summary, detail });
        setTimeout(() => setToastMessage(null), 3000);
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

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 0: // Dados de Inspeção
                if (!formData.localInspecao) newErrors.localInspecao = 'Campo obrigatório';
                if (!formData.nomeFuncionarioAutorizado) newErrors.nomeFuncionarioAutorizado = 'Campo obrigatório';
                if (!formData.dataEmissao) newErrors.dataEmissao = 'Campo obrigatório';
                break;

            case 1: // Dados da Mercadoria
                if (!formData.naturezaMercadoria) newErrors.naturezaMercadoria = 'Campo obrigatório';
                if (!formData.nomeBotanico) newErrors.nomeBotanico = 'Campo obrigatório';
                if (!formData.origem) newErrors.origem = 'Campo obrigatório';
                if (!formData.quantidadeVolumes) newErrors.quantidadeVolumes = 'Campo obrigatório';
                break;

            case 2: // Exportador e Destinatário
                if (!formData.nomeExportador) newErrors.nomeExportador = 'Campo obrigatório';
                if (!formData.enderecoExportador) newErrors.enderecoExportador = 'Campo obrigatório';
                if (!formData.nomeDestinatario) newErrors.nomeDestinatario = 'Campo obrigatório';
                if (!formData.enderecoDestinatario) newErrors.enderecoDestinatario = 'Campo obrigatório';
                break;

            case 3: // Transporte e Logística
                if (!formData.pontoEntrada) newErrors.pontoEntrada = 'Campo obrigatório';
                if (!formData.meioTransporte) newErrors.meioTransporte = 'Campo obrigatório';
                if (!formData.portoEntrada) newErrors.portoEntrada = 'Campo obrigatório';
                if (!formData.valorSelo) newErrors.valorSelo = 'Campo obrigatório';
                break;

            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Dados de Inspeção
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <BadgeCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Dados de Inspeção</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre o local e responsável pela inspeção fitossanitária.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Local de Inspeção"
                                    value={formData.localInspecao}
                                    onChange={(value) => handleInputChange('localInspecao', value)}
                                    required
                                    errorMessage={errors.localInspecao}
                                    placeholder="Ex: Porto de Luanda, Armazém 5"
                                    iconStart={<MapPin size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Nome do Funcionário Autorizado"
                                    value={formData.nomeFuncionarioAutorizado}
                                    onChange={(value) => handleInputChange('nomeFuncionarioAutorizado', value)}
                                    required
                                    errorMessage={errors.nomeFuncionarioAutorizado}
                                    placeholder="Nome completo do inspetor"
                                    iconStart={<User size={18} />}
                                />

                                <CustomInput
                                    type="date"
                                    label="Data de Emissão"
                                    value={formData.dataEmissao}
                                    onChange={(value) => handleInputChange('dataEmissao', value)}
                                    required
                                    errorMessage={errors.dataEmissao}
                                    iconStart={<Calendar size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1: // Dados da Mercadoria
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Package className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Dados da Mercadoria</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre a mercadoria vegetal a ser certificada.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Natureza da Mercadoria"
                                    value={formData.naturezaMercadoria}
                                    onChange={(value) => handleInputChange('naturezaMercadoria', value)}
                                    required
                                    errorMessage={errors.naturezaMercadoria}
                                    placeholder="Ex: Sementes, Mudas, Frutas frescas"
                                    iconStart={<Leaf size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Nome Botânico"
                                    value={formData.nomeBotanico}
                                    onChange={(value) => handleInputChange('nomeBotanico', value)}
                                    required
                                    errorMessage={errors.nomeBotanico}
                                    placeholder="Ex: Zea mays, Solanum lycopersicum"
                                    iconStart={<Leaf size={18} />}
                                    helperText="Nome científico da planta"
                                />

                                <CustomInput
                                    type="text"
                                    label="Origem (País/Região)"
                                    value={formData.origem}
                                    onChange={(value) => handleInputChange('origem', value)}
                                    required
                                    errorMessage={errors.origem}
                                    placeholder="Ex: Holanda, Brasil - São Paulo"
                                    iconStart={<MapPin size={18} />}
                                />

                                <CustomInput
                                    type="number"
                                    label="Quantidade de Volumes"
                                    value={formData.quantidadeVolumes}
                                    onChange={(value) => handleInputChange('quantidadeVolumes', value)}
                                    required
                                    errorMessage={errors.quantidadeVolumes}
                                    placeholder="Ex: 100"
                                    iconStart={<Package size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Natureza dos Volumes"
                                    value={formData.naturezaVolumes ? { label: formData.naturezaVolumes, value: formData.naturezaVolumes } : null}
                                    options={naturezaVolumesOptions}
                                    onChange={(value) => handleInputChange('naturezaVolumes', typeof value === 'object' ? value.value : value)}
                                    placeholder="Selecione o tipo de embalagem"
                                    iconStart={<Package size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Peso dos Volumes"
                                    value={formData.pesoVolumes}
                                    onChange={(value) => handleInputChange('pesoVolumes', value)}
                                    placeholder="Ex: 1500 kg, 2.5 toneladas"
                                    iconStart={<Package size={18} />}
                                />

                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="text"
                                        label="Marcas e Números"
                                        value={formData.marcasNumeros}
                                        onChange={(value) => handleInputChange('marcasNumeros', value)}
                                        placeholder="Ex: Lote ABC123, Marca XYZ"
                                        iconStart={<FileText size={18} />}
                                        helperText="Identificação dos volumes/lotes"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Exportador e Destinatário
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Exportador e Destinatário</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre o exportador e o destinatário da mercadoria.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Exportador</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <CustomInput
                                    type="text"
                                    label="Nome do Exportador"
                                    value={formData.nomeExportador}
                                    onChange={(value) => handleInputChange('nomeExportador', value)}
                                    required
                                    errorMessage={errors.nomeExportador}
                                    placeholder="Nome completo ou razão social"
                                    iconStart={<User size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Endereço do Exportador"
                                    value={formData.enderecoExportador}
                                    onChange={(value) => handleInputChange('enderecoExportador', value)}
                                    required
                                    errorMessage={errors.enderecoExportador}
                                    placeholder="Endereço completo"
                                    iconStart={<MapPin size={18} />}
                                />
                            </div>

                            <h4 className="text-lg font-semibold text-gray-800 mb-4">Dados do Destinatário</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome do Destinatário"
                                    value={formData.nomeDestinatario}
                                    onChange={(value) => handleInputChange('nomeDestinatario', value)}
                                    required
                                    errorMessage={errors.nomeDestinatario}
                                    placeholder="Nome completo ou razão social"
                                    iconStart={<User size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Endereço do Destinatário"
                                    value={formData.enderecoDestinatario}
                                    onChange={(value) => handleInputChange('enderecoDestinatario', value)}
                                    required
                                    errorMessage={errors.enderecoDestinatario}
                                    placeholder="Endereço completo"
                                    iconStart={<MapPin size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Transporte e Logística
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border border-amber-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <Truck className="w-6 h-6 text-amber-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Transporte e Logística</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre o transporte e pontos de entrada da mercadoria.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Ponto de Entrada"
                                    value={formData.pontoEntrada}
                                    onChange={(value) => handleInputChange('pontoEntrada', value)}
                                    required
                                    errorMessage={errors.pontoEntrada}
                                    placeholder="Ex: Aeroporto Internacional 4 de Fevereiro"
                                    iconStart={<MapPin size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Meio de Transporte"
                                    value={formData.meioTransporte ? { label: formData.meioTransporte, value: formData.meioTransporte } : null}
                                    options={meiosTransporteOptions}
                                    onChange={(value) => handleInputChange('meioTransporte', typeof value === 'object' ? value.value : value)}
                                    required
                                    errorMessage={errors.meioTransporte}
                                    placeholder="Selecione o meio de transporte"
                                    iconStart={<Truck size={18} />}
                                />

                                <CustomInput
                                    type="text"
                                    label="Porto de Entrada"
                                    value={formData.portoEntrada}
                                    onChange={(value) => handleInputChange('portoEntrada', value)}
                                    required
                                    errorMessage={errors.portoEntrada}
                                    placeholder="Ex: Porto de Luanda, Aeroporto de Luanda"
                                    iconStart={<Ship size={18} />}
                                />

                                <CustomInput
                                    type="number"
                                    label="Valor do Selo (KZ)"
                                    value={formData.valorSelo}
                                    onChange={(value) => handleInputChange('valorSelo', value)}
                                    required
                                    errorMessage={errors.valorSelo}
                                    placeholder="Ex: 5000"
                                    iconStart={<DollarSign size={18} />}
                                    helperText="Valor da taxa de certificação em Kwanzas"
                                />

                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="text"
                                        label="Tratamento Aplicado (Opcional)"
                                        value={formData.tratamentoAplicado}
                                        onChange={(value) => handleInputChange('tratamentoAplicado', value)}
                                        placeholder="Ex: Fumigação com brometo de metila"
                                        iconStart={<BadgeCheck size={18} />}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="textarea"
                                        label="Observações Adicionais"
                                        value={formData.observacoes}
                                        onChange={(value) => handleInputChange('observacoes', value)}
                                        placeholder="Informações adicionais relevantes..."
                                        rows={4}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center space-x-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.declaracaoDesinfeccao}
                                            onChange={(e) => handleInputChange('declaracaoDesinfeccao', e.target.checked)}
                                            className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                            <strong>Declaração:</strong> Certifico que as plantas, produtos vegetais ou outros artigos regulamentados descritos foram inspecionados e/ou testados de acordo com procedimentos apropriados e são considerados livres de pragas quarentenárias.
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Revisão Final
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Revisão Final</h3>
                            </div>
                            <p className="text-gray-600">
                                Revise todos os dados antes de gerar o Certificado Fitossanitário.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Dados de Inspeção */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <BadgeCheck className="w-5 h-5 mr-2 text-green-600" />
                                    Dados de Inspeção
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Local de Inspeção:</span>
                                        <p className="font-semibold text-gray-800">{formData.localInspecao || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Funcionário Autorizado:</span>
                                        <p className="font-semibold text-gray-800">{formData.nomeFuncionarioAutorizado || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Data de Emissão:</span>
                                        <p className="font-semibold text-gray-800">
                                            {formData.dataEmissao ? new Date(formData.dataEmissao).toLocaleDateString('pt-PT') : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Dados da Mercadoria */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                                    Dados da Mercadoria
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Natureza:</span>
                                        <p className="font-semibold text-gray-800">{formData.naturezaMercadoria || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Nome Botânico:</span>
                                        <p className="font-semibold text-gray-800 italic">{formData.nomeBotanico || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Origem:</span>
                                        <p className="font-semibold text-gray-800">{formData.origem || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Quantidade:</span>
                                        <p className="font-semibold text-gray-800">{formData.quantidadeVolumes || '0'} {formData.naturezaVolumes || 'volumes'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Peso:</span>
                                        <p className="font-semibold text-gray-800">{formData.pesoVolumes || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Marcas/Números:</span>
                                        <p className="font-semibold text-gray-800">{formData.marcasNumeros || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Exportador e Destinatário */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-purple-600" />
                                    Exportador e Destinatário
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Exportador:</h5>
                                        <p className="font-semibold text-gray-800">{formData.nomeExportador || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{formData.enderecoExportador || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <h5 className="text-sm font-semibold text-gray-700 mb-2">Destinatário:</h5>
                                        <p className="font-semibold text-gray-800">{formData.nomeDestinatario || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{formData.enderecoDestinatario || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Transporte e Logística */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Truck className="w-5 h-5 mr-2 text-amber-600" />
                                    Transporte e Logística
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Ponto de Entrada:</span>
                                        <p className="font-semibold text-gray-800">{formData.pontoEntrada || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Meio de Transporte:</span>
                                        <p className="font-semibold text-gray-800">{formData.meioTransporte || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Porto de Entrada:</span>
                                        <p className="font-semibold text-gray-800">{formData.portoEntrada || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Valor do Selo:</span>
                                        <p className="font-semibold text-green-600">
                                            {formData.valorSelo ? `${parseFloat(formData.valorSelo).toLocaleString('pt-AO')} KZ` : 'N/A'}
                                        </p>
                                    </div>
                                    {formData.tratamentoAplicado && (
                                        <div className="md:col-span-2">
                                            <span className="text-sm text-gray-500">Tratamento Aplicado:</span>
                                            <p className="font-semibold text-gray-800">{formData.tratamentoAplicado}</p>
                                        </div>
                                    )}
                                </div>

                                {formData.observacoes && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                        <span className="text-sm text-gray-500">Observações:</span>
                                        <p className="text-gray-800 mt-1">{formData.observacoes}</p>
                                    </div>
                                )}

                                {formData.declaracaoDesinfeccao && (
                                    <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm text-green-800">
                                                <strong>Declaração confirmada:</strong> O material foi inspecionado e está livre de pragas quarentenárias.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            showToast('error', 'Validação', 'Por favor, preencha todos os campos obrigatórios.');
        }
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            if (!formData.declaracaoDesinfeccao) {
                showToast('error', 'Validação', 'É necessário confirmar a declaração de inspeção fitossanitária.');
                setLoading(false);
                return;
            }

            // 🔁 Mapeamento dos campos conforme o backend
            const payload = {
                localDeInspecao: formData.localInspecao,
                nomeDoFuncionarioAutorizado: formData.nomeFuncionarioAutorizado,
                dataDeEmissao: formData.dataEmissao,
                naturezaDaMercadoria: formData.naturezaMercadoria,
                nomeBotanico: formData.nomeBotanico,
                origem: formData.origem,
                quantidadeDeVolumes: parseInt(formData.quantidadeVolumes) || 0,
                naturezaDosVolumes: formData.naturezaVolumes,
                pesoDosVolumes: formData.pesoVolumes,
                marcasENumeros: formData.marcasNumeros,
                nomeDoExportador: formData.nomeExportador,
                enderecoDoExportador: formData.enderecoExportador,
                nomeDoDestinatario: formData.nomeDestinatario,
                enderecoDoDestinatario: formData.enderecoDestinatario,
                pontoDeEntrada: formData.pontoEntrada,
                meioDeTransporte: formData.meioTransporte,
                portoDeEntrada: formData.portoEntrada,
                valorDoSelo: parseFloat(formData.valorSelo) || 0,
                tratamentoAplicado: formData.tratamentoAplicado,
                observacoesAdicionais: formData.observacoes,
                confirmacaoDaDeclaracao: formData.declaracaoDesinfeccao
            };

            console.log('📦 Enviando dados para API:', payload);

            const response = await axios.post(
                'https://mwangobrainsa-001-site2.mtempurl.com/api/certificaoFitossanitario',
                payload,
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('✅ Certificado cadastrado com sucesso:', response.data);
            showToast('success', 'Sucesso', 'Certificado cadastrado e emitido com sucesso!');

            // 🔧 Se quiser gerar o PDF após o cadastro
            await gerarCertificadoFitossanitario(formData);

        } catch (error) {
            console.error('❌ Erro ao cadastrar certificado:', error);
            const message =
                error.response?.data?.message ||
                error.message ||
                'Erro ao cadastrar certificado.';
            showToast('error', 'Erro', message);
        } finally {
            setLoading(false);
        }
    };

    const isLastStep = activeStep === steps.length - 1;

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

            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                        <div className="flex items-center justify-center mb-4">
                            <Leaf className="w-12 h-12 text-green-600 mr-3" />
                            <h1 className="text-4xl font-bold text-gray-800">Certificado Fitossanitário</h1>
                        </div>
                        <p className="text-gray-600">Sistema de Emissão de Certificados Fitossanitários</p>
                        <p className="text-sm text-gray-500 mt-2">Instituto de Desenvolvimento Florestal (IDF) - Angola</p>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeStep ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => index <= activeStep && setActiveStep(index)}
                                >
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index < activeStep ? 'bg-green-500 text-white' :
                                        index === activeStep ? 'bg-green-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index < activeStep ? (
                                            <Check size={24} />
                                        ) : (
                                            <StepIcon size={24} />
                                        )}
                                    </div>
                                    <span className={`text-sm text-center font-medium ${index === activeStep ? 'text-green-700' : 'text-gray-500'
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
                            className="bg-green-600 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Content */}
                    <div className="step-content p-8 bg-white min-h-[600px]">
                        {renderStepContent(activeStep)}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
                        <button
                            className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeStep === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                                }`}
                            onClick={() => {
                                setActiveStep((prev) => Math.max(prev - 1, 0));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            disabled={activeStep === 0}
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            Anterior
                        </button>

                        <div className="text-sm text-gray-500 font-medium">
                            Etapa {activeStep + 1} de {steps.length}
                        </div>

                        <button
                            className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                }`}
                            disabled={loading}
                            onClick={() => {
                                if (!isLastStep) {
                                    handleNext();
                                } else {
                                    handleSubmit();
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Gerando Certificado...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <BadgeCheck size={20} className="mr-2" />
                                    Emitir Certificado Fitossanitário
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

export default CertificadoFitossanitario;