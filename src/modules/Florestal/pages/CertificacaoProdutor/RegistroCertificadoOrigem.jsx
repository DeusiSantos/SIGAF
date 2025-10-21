import {
    AlertCircle,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    Globe,
    Info,
    Loader,
    MapPin,
    Package,
    Plus,
    Search,
    Trash2,
    Truck,
    User
} from 'lucide-react';
import { useState } from 'react';

const RegistroCertificadoOrigem = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tipoCertificado, setTipoCertificado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    const [formData, setFormData] = useState({
        // Dados básicos
        numeroCertificado: '',
        dataValidade: '',
        tipoOperacao: '', // Exportação, Importação, Reexportação

        // Exportador
        exportadorNome: '',
        exportadorEndereco: '',

        // Importador
        importadorNome: '',
        importadorEndereco: '',

        // Destinatário
        destinatarioNome: '',
        destinatarioEndereco: '',

        // Origem e Destino
        paisOrigem: '',
        viaTransporte: '',
        pontoSaida: '',
        paisDestino: '',
        pontoEntrada: '',

        // Documentos Aduaneiros
        documentoCarga: '',
        alfandegaSaida: '',
        dataAlfandega: ''
    });

    const steps = [
        { label: 'Tipo de Operação', icon: Search },
        { label: 'Partes Envolvidas', icon: User },
        { label: 'Transporte e Origem', icon: Truck },
        { label: 'Produtos', icon: Package },
        { label: 'Resumo', icon: CheckCircle }
    ];

    const tiposOperacao = [
        { value: 'exportacao', label: 'Exportação', description: 'Envio de produtos para o exterior' },
        { value: 'importacao', label: 'Importação', description: 'Recebimento de produtos do exterior' },
        { value: 'reexportacao', label: 'Reexportação', description: 'Reenvio de produtos importados' }
    ];

    const paisesOptions = [
        { label: 'Angola', value: 'Angola' },
        { label: 'Portugal', value: 'Portugal' },
        { label: 'Brasil', value: 'Brasil' },
        { label: 'África do Sul', value: 'África do Sul' },
        { label: 'China', value: 'China' },
        { label: 'Estados Unidos', value: 'Estados Unidos' }
    ];

    const viasTransporteOptions = [
        { label: 'Aéreo', value: 'Aéreo' },
        { label: 'Marítimo', value: 'Marítimo' },
        { label: 'Terrestre', value: 'Terrestre' },
        { label: 'Ferroviário', value: 'Ferroviário' }
    ];

    const qualidadeOptions = [
        { label: 'Premium', value: 'Premium' },
        { label: 'Standard', value: 'Standard' },
        { label: 'Grade A', value: 'Grade A' },
        { label: 'Grade B', value: 'Grade B' }
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

    const adicionarProduto = () => {
        const novoProduto = {
            id: Date.now(),
            nomeVulgar: '',
            nomeCientifico: '',
            grupoQualidade: '',
            qualidade: '',
            pesoLiquido: '',
            volume: ''
        };
        setProdutos([...produtos, novoProduto]);
    };

    const removerProduto = (id) => {
        setProdutos(produtos.filter(item => item.id !== id));
    };

    const atualizarProduto = (id, campo, valor) => {
        setProdutos(produtos.map(item =>
            item.id === id ? { ...item, [campo]: valor } : item
        ));
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Tipo de Operação
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Search className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Tipo de Operação</h3>
                            </div>
                            <p className="text-gray-600">
                                Selecione o tipo de operação para o Certificado de Origem.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {tiposOperacao.map((tipo) => (
                                    <button
                                        key={tipo.value}
                                        className={`p-8 rounded-xl border-2 transition-all text-center hover:shadow-lg ${tipoCertificado === tipo.value
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 hover:border-green-300'
                                            }`}
                                        onClick={() => {
                                            setTipoCertificado(tipo.value);
                                            handleInputChange('tipoOperacao', tipo.value);
                                        }}
                                    >
                                        <FileText size={48} className="mx-auto mb-4" />
                                        <h4 className="font-semibold text-lg mb-2">{tipo.label}</h4>
                                        <p className="text-sm text-gray-600">{tipo.description}</p>
                                    </button>
                                ))}
                            </div>

                            {tipoCertificado && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <p className="text-green-800 font-medium">
                                            Operação selecionada: {tiposOperacao.find(t => t.value === tipoCertificado)?.label}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 1: // Partes Envolvidas
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Partes Envolvidas</h3>
                            </div>
                            <p className="text-gray-600">
                                Preencha os dados do exportador, importador e destinatário.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                            {/* Exportador */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <User size={20} className="mr-2 text-blue-600" />
                                    Exportador
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        value={formData.exportadorNome}
                                        onChange={(e) => handleInputChange('exportadorNome', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Nome do exportador"
                                    />
                                    <textarea
                                        value={formData.exportadorEndereco}
                                        onChange={(e) => handleInputChange('exportadorEndereco', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        rows="2"
                                        placeholder="Endereço completo do exportador"
                                    />
                                </div>
                            </div>

                            {/* Importador */}
                            <div className="border-b border-gray-200 pb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <User size={20} className="mr-2 text-green-600" />
                                    Importador
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        value={formData.importadorNome}
                                        onChange={(e) => handleInputChange('importadorNome', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Nome do importador"
                                    />
                                    <textarea
                                        value={formData.importadorEndereco}
                                        onChange={(e) => handleInputChange('importadorEndereco', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        rows="2"
                                        placeholder="Endereço completo do importador"
                                    />
                                </div>
                            </div>

                            {/* Destinatário */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <MapPin size={20} className="mr-2 text-purple-600" />
                                    Destinatário
                                </h4>
                                <div className="grid grid-cols-1 gap-4">
                                    <input
                                        type="text"
                                        value={formData.destinatarioNome}
                                        onChange={(e) => handleInputChange('destinatarioNome', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Nome do destinatário"
                                    />
                                    <textarea
                                        value={formData.destinatarioEndereco}
                                        onChange={(e) => handleInputChange('destinatarioEndereco', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        rows="2"
                                        placeholder="Endereço completo do destinatário"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Transporte e Origem
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Truck className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Transporte e Origem</h3>
                            </div>
                            <p className="text-gray-600">
                                Informe os detalhes de transporte e localização de origem/destino.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Globe size={16} className="inline mr-2" />
                                        País de Origem
                                    </label>
                                    <select
                                        value={formData.paisOrigem}
                                        onChange={(e) => handleInputChange('paisOrigem', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Selecione o país</option>
                                        {paisesOptions.map(pais => (
                                            <option key={pais.value} value={pais.value}>{pais.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Truck size={16} className="inline mr-2" />
                                        Via de Transporte
                                    </label>
                                    <select
                                        value={formData.viaTransporte}
                                        onChange={(e) => handleInputChange('viaTransporte', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Selecione a via</option>
                                        {viasTransporteOptions.map(via => (
                                            <option key={via.value} value={via.value}>{via.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Ponto de Saída
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.pontoSaida}
                                        onChange={(e) => handleInputChange('pontoSaida', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Porto/Aeroporto de saída"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        <Globe size={16} className="inline mr-2" />
                                        País de Destino
                                    </label>
                                    <select
                                        value={formData.paisDestino}
                                        onChange={(e) => handleInputChange('paisDestino', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    >
                                        <option value="">Selecione o país</option>
                                        {paisesOptions.map(pais => (
                                            <option key={pais.value} value={pais.value}>{pais.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Ponto de Entrada
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.pontoEntrada}
                                        onChange={(e) => handleInputChange('pontoEntrada', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Porto/Aeroporto de entrada"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Documento de Carga
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.documentoCarga}
                                        onChange={(e) => handleInputChange('documentoCarga', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Número do documento"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Alfândega de Saída
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.alfandegaSaida}
                                        onChange={(e) => handleInputChange('alfandegaSaida', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Nome da alfândega"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Data Alfândega
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.dataAlfandega}
                                        onChange={(e) => handleInputChange('dataAlfandega', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Produtos
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Descrição dos Produtos</h3>
                            </div>
                            <p className="text-gray-600">
                                Registre os produtos que constam no certificado de origem.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-lg font-semibold text-gray-800">Lista de Produtos</h4>
                                <button
                                    onClick={adicionarProduto}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Adicionar Produto
                                </button>
                            </div>

                            {produtos.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Nome Vulgar</th>
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Nome Científico</th>
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Grupo/Qualidade</th>
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Qualidade</th>
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Peso Líquido (kg)</th>
                                                <th className="border border-gray-300 p-3 text-left font-semibold">Volume (m³)</th>
                                                <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {produtos.map((item, index) => (
                                                <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            value={item.nomeVulgar}
                                                            onChange={(e) => atualizarProduto(item.id, 'nomeVulgar', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded text-sm"
                                                            placeholder="Nome comum"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            value={item.nomeCientifico}
                                                            onChange={(e) => atualizarProduto(item.id, 'nomeCientifico', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded text-sm"
                                                            placeholder="Nome científico"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="text"
                                                            value={item.grupoQualidade}
                                                            onChange={(e) => atualizarProduto(item.id, 'grupoQualidade', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded text-sm"
                                                            placeholder="Grupo"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <select
                                                            value={item.qualidade}
                                                            onChange={(e) => atualizarProduto(item.id, 'qualidade', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded text-sm"
                                                        >
                                                            <option value="">Selecione</option>
                                                            {qualidadeOptions.map(q => (
                                                                <option key={q.value} value={q.value}>{q.label}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="number"
                                                            value={item.pesoLiquido}
                                                            onChange={(e) => atualizarProduto(item.id, 'pesoLiquido', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded text-sm"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2">
                                                        <input
                                                            type="number"
                                                            value={item.volume}
                                                            onChange={(e) => atualizarProduto(item.id, 'volume', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded text-sm"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder="0.00"
                                                        />
                                                    </td>
                                                    <td className="border border-gray-300 p-2 text-center">
                                                        <button
                                                            onClick={() => removerProduto(item.id)}
                                                            className="text-red-600 hover:text-red-800 transition-colors"
                                                            title="Remover produto"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <Package size={48} className="mx-auto mb-4 text-gray-300" />
                                    <p className="text-lg font-medium">Nenhum produto registado</p>
                                    <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 4: // Resumo
                return (
                    <div className="w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Resumo do Certificado</h3>
                            </div>
                            <p className="text-gray-600">
                                Revise todas as informações antes de emitir o certificado.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Dados Básicos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Informações Básicas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm text-gray-500">Tipo de Operação:</span>
                                        <p className="font-semibold text-gray-800">
                                            {tiposOperacao.find(t => t.value === tipoCertificado)?.label || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Via de Transporte:</span>
                                        <p className="font-semibold text-gray-800">{formData.viaTransporte || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">País de Origem:</span>
                                        <p className="font-semibold text-gray-800">{formData.paisOrigem || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">País de Destino:</span>
                                        <p className="font-semibold text-gray-800">{formData.paisDestino || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Partes Envolvidas */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Partes Envolvidas</h4>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-sm text-gray-500 font-medium">Exportador:</span>
                                        <p className="text-gray-800">{formData.exportadorNome || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{formData.exportadorEndereco || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 font-medium">Importador:</span>
                                        <p className="text-gray-800">{formData.importadorNome || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{formData.importadorEndereco || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500 font-medium">Destinatário:</span>
                                        <p className="text-gray-800">{formData.destinatarioNome || 'N/A'}</p>
                                        <p className="text-sm text-gray-600">{formData.destinatarioEndereco || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Resumo dos Produtos */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4">Produtos</h4>
                                {produtos.length > 0 ? (
                                    <div className="space-y-3">
                                        {produtos.map((item, index) => (
                                            <div key={item.id} className="p-4 bg-gray-50 rounded-lg">
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Nome:</span>
                                                        <p className="font-semibold">{item.nomeVulgar || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Científico:</span>
                                                        <p className="font-semibold">{item.nomeCientifico || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Peso (kg):</span>
                                                        <p className="font-semibold">{item.pesoLiquido || '0'}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Volume (m³):</span>
                                                        <p className="font-semibold">{item.volume || '0'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Nenhum produto registado</p>
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
        if (activeStep === 0 && !tipoCertificado) {
            showToast('error', 'Validação', 'Por favor, selecione o tipo de operação.');
            return;
        }

        if (activeStep === 1) {
            if (!formData.exportadorNome || !formData.importadorNome) {
                showToast('error', 'Validação', 'Por favor, preencha os dados do exportador e importador.');
                return;
            }
        }

        if (activeStep === 2) {
            if (!formData.paisOrigem || !formData.viaTransporte) {
                showToast('error', 'Validação', 'Por favor, preencha os dados de transporte e origem.');
                return;
            }
        }

        if (activeStep === 3 && produtos.length === 0) {
            showToast('error', 'Validação', 'Por favor, adicione pelo menos um produto.');
            return;
        }

        setActiveStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async () => {
        setLoading(true);

        try {
            // Validações
            if (produtos.length === 0) {
                showToast('error', 'Validação', 'Adicione pelo menos um produto antes de finalizar.');
                setLoading(false);
                return;
            }

            // Validar campos obrigatórios
            if (!formData.exportadorNome || !formData.importadorNome) {
                showToast('error', 'Validação', 'Preencha os dados do exportador e importador.');
                setLoading(false);
                return;
            }

            if (!formData.paisOrigem || !formData.viaTransporte) {
                showToast('error', 'Validação', 'Preencha os dados de transporte e origem.');
                setLoading(false);
                return;
            }

            // Importar a função de geração de PDF dinamicamente
            const { gerarCertificadoOrigem } = await import('./CertificadoOrigemDocument');

            // Preparar dados para o PDF
            const dadosParaPDF = {
                formData: {
                    ...formData,
                    dataValidade: formData.dataValidade || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                },
                tipoCertificado,
                produtos: produtos.map(p => ({
                    nomeVulgar: p.nomeVulgar,
                    nomeCientifico: p.nomeCientifico,
                    grupoQualidade: p.grupoQualidade,
                    qualidade: p.qualidade,
                    pesoLiquido: parseFloat(p.pesoLiquido) || 0,
                    volume: parseFloat(p.volume) || 0
                }))
            };

            console.log('📋 Dados preparados para PDF:', dadosParaPDF);

            // Gerar o PDF do Certificado de Origem
            const resultado = await gerarCertificadoOrigem(dadosParaPDF);

            console.log('✅ Resultado:', resultado);

            // Preparar dados para envio à API (opcional)
            const dadosEnvio = {
                numeroCertificado: resultado.numeroCertificado,
                tipoOperacao: tipoCertificado,
                dataEmissao: new Date().toISOString(),
                exportador: {
                    nome: formData.exportadorNome,
                    endereco: formData.exportadorEndereco
                },
                importador: {
                    nome: formData.importadorNome,
                    endereco: formData.importadorEndereco
                },
                destinatario: {
                    nome: formData.destinatarioNome,
                    endereco: formData.destinatarioEndereco
                },
                transporte: {
                    paisOrigem: formData.paisOrigem,
                    viaTransporte: formData.viaTransporte,
                    pontoSaida: formData.pontoSaida,
                    paisDestino: formData.paisDestino,
                    pontoEntrada: formData.pontoEntrada,
                    documentoCarga: formData.documentoCarga,
                    alfandegaSaida: formData.alfandegaSaida,
                    dataAlfandega: formData.dataAlfandega
                },
                produtos: dadosParaPDF.produtos
            };

            console.log('📤 Dados para enviar à API:', dadosEnvio);

            // Aqui você pode fazer a chamada à API
            // const response = await fetch('URL_DA_API', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(dadosEnvio)
            // });

            showToast('success', 'Sucesso', resultado.message);

            // Opcional: Resetar o formulário após sucesso
            setTimeout(() => {
                setFormData({
                    numeroCertificado: '',
                    dataValidade: '',
                    tipoOperacao: '',
                    exportadorNome: '',
                    exportadorEndereco: '',
                    importadorNome: '',
                    importadorEndereco: '',
                    destinatarioNome: '',
                    destinatarioEndereco: '',
                    paisOrigem: '',
                    viaTransporte: '',
                    pontoSaida: '',
                    paisDestino: '',
                    pontoEntrada: '',
                    documentoCarga: '',
                    alfandegaSaida: '',
                    dataAlfandega: ''
                });
                setProdutos([]);
                setActiveStep(0);
                setTipoCertificado(null);
            }, 2000);

        } catch (error) {
            console.error('❌ Erro ao processar certificado:', error);
            showToast('error', 'Erro', error.message || 'Erro ao emitir certificado. Tente novamente.');
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
                    <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-blue-50">
                        <div className="flex justify-center mb-4">
                            <FileText size={48} className="text-green-600" />
                        </div>
                        <h1 className="text-4xl font-bold mb-3 text-gray-800">Certificado de Origem</h1>
                        <p className="text-gray-600">Ministério da Agricultura - Instituto de Desenvolvimento Florestal</p>
                        <p className="text-sm text-gray-500 mt-2">República de Angola</p>
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
                                    Processando...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <CheckCircle size={20} className="mr-2" />
                                    Emitir Certificado
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

export default RegistroCertificadoOrigem;