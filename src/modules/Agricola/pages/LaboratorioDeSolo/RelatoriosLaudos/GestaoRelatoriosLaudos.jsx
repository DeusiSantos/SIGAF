import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    DollarSign,
    Eye,
    FileText,
    History,
    LineChart,
    MoreVertical,
    PieChart,
    PlusCircle,
    Receipt,
    Search,
    TrendingUp,
    User,
    X
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';

// Dados fictícios dos laudos
const laudosData = [
    {
        id: 1,
        codigoAmostra: "SL-2025-0001",
        produtor: "João Manuel Silva",
        dataAnalise: "2025-01-15",
        tecnicoResponsavel: "José Pedro Santos",
        supervisor: "Dr. António Silva",
        status: "CONCLUIDO",
        parametros: [
            { parametro: "pH", valor: 6.8, unidade: "—", status: "Dentro do padrão" },
            { parametro: "Fósforo (P)", valor: 12.5, unidade: "mg/dm³", status: "Abaixo do padrão" },
            { parametro: "Potássio (K)", valor: 0.25, unidade: "cmolc/dm³", status: "Dentro do padrão" }
        ]
    },
    {
        id: 2,
        codigoAmostra: "SL-2025-0002",
        produtor: "Maria Fernanda Costa",
        dataAnalise: "2025-01-14",
        tecnicoResponsavel: "Ana Paula Costa",
        supervisor: "Dr. Carlos Mendes",
        status: "CONCLUIDO",
        parametros: [
            { parametro: "pH", valor: 7.2, unidade: "—", status: "Dentro do padrão" },
            { parametro: "Matéria Orgânica", valor: 3.8, unidade: "%", status: "Dentro do padrão" }
        ]
    }
];

// Dados fictícios das faturas
const faturasData = [
    {
        id: 1,
        numero: "FPN.2025.0001",
        cliente: "João Manuel Silva",
        codigoAmostra: "SL-2025-0001",
        tipo: "PRO_FORMA",
        valorTotal: 9500,
        status: "PENDENTE",
        dataEmissao: "2025-01-10",
        prazoValidade: "2025-01-13"
    },
    {
        id: 2,
        numero: "FPN.2025.0002",
        cliente: "Maria Fernanda Costa",
        codigoAmostra: "SL-2025-0002",
        tipo: "FINAL",
        valorTotal: 12300,
        status: "PAGO",
        dataEmissao: "2025-01-15",
        prazoValidade: "2025-01-18"
    },
    {
        id: 3,
        numero: "FPN.2025.0003",
        cliente: "Carlos Alberto Mendes",
        codigoAmostra: "SL-2025-0003",
        tipo: "PRO_FORMA",
        valorTotal: 7800,
        status: "PENDENTE",
        dataEmissao: "2025-01-12",
        prazoValidade: "2025-01-15"
    }
];

// Dados fictícios do histórico
const historicoData = [
    {
        id: 1,
        produtor: "João Manuel Silva",
        codigoAmostra: "SL-2025-0001",
        parametro: "pH",
        valorObtido: 6.8,
        unidade: "—",
        metodo: "Potenciométrico",
        dataAnalise: "2025-01-15",
        status: "Dentro do padrão",
        tecnico: "José Pedro Santos"
    },
    {
        id: 2,
        produtor: "João Manuel Silva",
        codigoAmostra: "SL-2025-0001",
        parametro: "Fósforo (P)",
        valorObtido: 12.5,
        unidade: "mg/dm³",
        metodo: "Fotocolorimetria",
        dataAnalise: "2025-01-15",
        status: "Abaixo do padrão",
        tecnico: "José Pedro Santos"
    },
    {
        id: 3,
        produtor: "Maria Fernanda Costa",
        codigoAmostra: "SL-2025-0002",
        parametro: "pH",
        valorObtido: 7.2,
        unidade: "—",
        metodo: "Potenciométrico",
        dataAnalise: "2025-01-14",
        status: "Dentro do padrão",
        tecnico: "Ana Paula Costa"
    }
];

const GestaoRelatoriosLaudos = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('laudos');
   {/* const [searchTerm, setSearchTerm] = useState('');
    const [selectedProdutor, setSelectedProdutor] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);*/}
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 6;
    const containerRef = useRef(null);

    // Ajustar altura do conteúdo
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const headerHeight = 240;
                const windowHeight = window.innerHeight;
                const availableHeight = windowHeight - headerHeight;
                setContentHeight(`${availableHeight}px`);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Limpar timeout
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Função para mostrar toast
    const showToast = (type, title, message, duration = 5000) => {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        setToastMessage({ type, title, message });

        const timeout = setTimeout(() => {
            setToastMessage(null);
        }, duration);

        setToastTimeout(timeout);
    };

    // Função para obter status badge das faturas
    const getStatusBadgeFatura = (status) => {
        switch (status) {
            case 'PAGO':
                return 'bg-green-100 text-green-800';
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'VENCIDO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Função para obter texto do tipo de fatura
    const getTipoFaturaText = (tipo) => {
        switch (tipo) {
            case 'PRO_FORMA':
                return 'Pro-forma';
            case 'FINAL':
                return 'Final';
            default:
                return tipo;
        }
    };

    // Componente Toast
    const Toast = () => {
        if (!toastMessage) return null;

        const { type, title, message } = toastMessage;

        let bgColor, icon;
        switch (type) {
            case 'success':
                bgColor = 'bg-green-50 border-l-4 border-green-500 text-green-700';
                icon = <CheckCircle className="w-5 h-5" />;
                break;
            case 'error':
                bgColor = 'bg-red-50 border-l-4 border-red-500 text-red-700';
                icon = <AlertCircle className="w-5 h-5" />;
                break;
            case 'info':
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
                icon = <AlertCircle className="w-5 h-5" />;
                break;
            default:
                bgColor = 'bg-gray-50 border-l-4 border-gray-500 text-gray-700';
                icon = <AlertCircle className="w-5 h-5" />;
        }

        return (
            <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor} animate-fadeIn`}>
                <div className="flex items-center">
                    <div className="mr-3">{icon}</div>
                    <div>
                        <h3 className="font-medium">{title}</h3>
                        <p className="text-sm mt-1">{message}</p>
                    </div>
                    <button
                        className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                        onClick={() => setToastMessage(null)}
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    // Aba 1: Laudos Técnicos
    const renderLaudosTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                    Gerar Laudos Técnicos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <CustomInput
                        type="select"
                        label="Código da Amostra"
                        placeholder="Selecione uma amostra"
                        options={laudosData.map(laudo => ({
                            label: laudo.codigoAmostra,
                            value: laudo.codigoAmostra
                        }))}
                        iconStart={<Search size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Produtor"
                        placeholder="Nome do produtor"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="date"
                        label="Data da Análise"
                        iconStart={<Calendar size={18} />}
                    />
                </div>

                {/* Lista de Laudos Disponíveis */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-5">
                    <h3 className="text-lg font-semibold mb-4">Laudos Disponíveis</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produtor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {laudosData.map((laudo) => (
                                    <tr key={laudo.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{laudo.codigoAmostra}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{laudo.produtor}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(laudo.dataAnalise).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{laudo.tecnicoResponsavel}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                {laudo.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex space-x-2">
                                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => showToast('success', 'Laudo Gerado', 'PDF do laudo técnico foi gerado com sucesso!')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Excel
                    </button>

                </div>
            </div>


        </div>
    );

    // Dados fictícios para os gráficos
    const dadosGraficos = {
        soloPorCultura: [
            { cultura: 'Milho', ph: 6.5, fosforo: 18, potassio: 0.28, amostras: 45 },
            { cultura: 'Feijão', ph: 6.8, fosforo: 22, potassio: 0.35, amostras: 32 },
            { cultura: 'Soja', ph: 6.2, fosforo: 15, potassio: 0.22, amostras: 28 },
            { cultura: 'Mandioca', ph: 5.9, fosforo: 12, potassio: 0.18, amostras: 38 }
        ],
        soloPorRegiao: [
            { regiao: 'Luanda', percentual: 35, amostras: 67 },
            { regiao: 'Huambo', percentual: 28, amostras: 54 },
            { regiao: 'Benguela', percentual: 22, amostras: 42 },
            { regiao: 'Huíla', percentual: 15, amostras: 29 }
        ],
        evolucaoTemporal: [
            { mes: 'Jan', ph: 6.2, fosforo: 16, potassio: 0.25 },
            { mes: 'Fev', ph: 6.4, fosforo: 18, potassio: 0.27 },
            { mes: 'Mar', ph: 6.6, fosforo: 20, potassio: 0.29 },
            { mes: 'Abr', ph: 6.5, fosforo: 19, potassio: 0.28 },
            { mes: 'Mai', ph: 6.7, fosforo: 21, potassio: 0.31 }
        ]
    };

    // Componente de Gráfico de Barras
    const BarChart = ({ data, title }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return (
                <div className="h-48 p-4 flex items-center justify-center">
                    <p className="text-gray-500">Nenhum dado disponível</p>
                </div>
            );
        }

        const maxValue = Math.max(...data.map(d => Math.max(d.ph * 10, d.fosforo, d.potassio * 100)));

        return (
            <div className="h-48 p-4">
                <h5 className="text-sm font-medium mb-3 text-center">{title}</h5>
                <div className="flex items-end justify-around h-32 border-b border-l border-gray-300">
                    {data.map((item, index) => {
                        const phHeight = (item.ph * 10 / maxValue) * 100;
                        const fosforoHeight = (item.fosforo / maxValue) * 100;
                        const potassioHeight = (item.potassio * 100 / maxValue) * 100;

                        return (
                            <div key={index} className="flex flex-col items-center space-y-1">
                                <div className="flex space-x-1 items-end">
                                    <div
                                        className="w-3 bg-blue-500 rounded-t"
                                        style={{ height: `${phHeight}px` }}
                                        title={`pH: ${item.ph}`}
                                    ></div>
                                    <div
                                        className="w-3 bg-green-500 rounded-t"
                                        style={{ height: `${fosforoHeight}px` }}
                                        title={`P: ${item.fosforo} mg/dm³`}
                                    ></div>
                                    <div
                                        className="w-3 bg-purple-500 rounded-t"
                                        style={{ height: `${potassioHeight}px` }}
                                        title={`K: ${item.potassio} cmolc/dm³`}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600 transform -rotate-45 origin-center">
                                    {item.cultura}
                                </span>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-center mt-2 space-x-4 text-xs">
                    <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 mr-1"></div>pH</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>P</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>K</div>
                </div>
            </div>
        );
    };

    // Componente de Gráfico de Pizza
    const PieChart = ({ data, title }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return (
                <div className="h-48 p-4 flex items-center justify-center">
                    <p className="text-gray-500">Nenhum dado disponível</p>
                </div>
            );
        }

        const total = data.reduce((sum, item) => sum + item.amostras, 0);
        let currentAngle = 0;
        const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

        return (
            <div className="h-48 p-4">
                <h5 className="text-sm font-medium mb-3 text-center">{title}</h5>
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <svg width="120" height="120" className="transform -rotate-90">
                            {data.map((item, index) => {
                                const percentage = (item.amostras / total) * 100;
                                const angle = (percentage / 100) * 360;
                                const startAngle = currentAngle;
                                const endAngle = currentAngle + angle;

                                const x1 = 60 + 50 * Math.cos((startAngle * Math.PI) / 180);
                                const y1 = 60 + 50 * Math.sin((startAngle * Math.PI) / 180);
                                const x2 = 60 + 50 * Math.cos((endAngle * Math.PI) / 180);
                                const y2 = 60 + 50 * Math.sin((endAngle * Math.PI) / 180);

                                const largeArcFlag = angle > 180 ? 1 : 0;

                                const pathData = [
                                    `M 60 60`,
                                    `L ${x1} ${y1}`,
                                    `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                                    'Z'
                                ].join(' ');

                                currentAngle += angle;

                                return (
                                    <path
                                        key={index}
                                        d={pathData}
                                        fill={colors[index % colors.length]}
                                        stroke="white"
                                        strokeWidth="2"
                                    />
                                );
                            })}
                        </svg>
                    </div>
                    <div className="ml-4 space-y-1">
                        {data.map((item, index) => (
                            <div key={index} className="flex items-center text-xs">
                                <div
                                    className="w-3 h-3 rounded mr-2"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                ></div>
                                <span>{item.regiao}: {item.percentual}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Componente de Gráfico de Linha
    const LineChart = ({ data, title }) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return (
                <div className="h-48 p-4 flex items-center justify-center">
                    <p className="text-gray-500">Nenhum dado disponível</p>
                </div>
            );
        }

        const maxPh = Math.max(...data.map(d => d.ph));
        const minPh = Math.min(...data.map(d => d.ph));
        const maxP = Math.max(...data.map(d => d.fosforo));
        const maxK = Math.max(...data.map(d => d.potassio));

        const getY = (value, max, min = 0) => {
            return 100 - ((value - min) / (max - min)) * 80;
        };

        return (
            <div className="h-48 p-4">
                <h5 className="text-sm font-medium mb-3 text-center">{title}</h5>
                <div className="relative h-32 border-b border-l border-gray-300">
                    <svg width="100%" height="100%" className="absolute inset-0">
                        {/* Linha pH */}
                        <polyline
                            fill="none"
                            stroke="#3B82F6"
                            strokeWidth="2"
                            points={data.map((item, index) =>
                                `${(index / (data.length - 1)) * 100}%,${getY(item.ph, maxPh, minPh)}%`
                            ).join(' ')}
                        />
                        {/* Linha Fósforo */}
                        <polyline
                            fill="none"
                            stroke="#10B981"
                            strokeWidth="2"
                            points={data.map((item, index) =>
                                `${(index / (data.length - 1)) * 100}%,${getY(item.fosforo, maxP)}%`
                            ).join(' ')}
                        />
                        {/* Linha Potássio */}
                        <polyline
                            fill="none"
                            stroke="#8B5CF6"
                            strokeWidth="2"
                            points={data.map((item, index) =>
                                `${(index / (data.length - 1)) * 100}%,${getY(item.potassio, maxK)}%`
                            ).join(' ')}
                        />
                        {/* Pontos */}
                        {data.map((item, index) => (
                            <g key={index}>
                                <circle cx={`${(index / (data.length - 1)) * 100}%`} cy={`${getY(item.ph, maxPh, minPh)}%`} r="3" fill="#3B82F6" />
                                <circle cx={`${(index / (data.length - 1)) * 100}%`} cy={`${getY(item.fosforo, maxP)}%`} r="3" fill="#10B981" />
                                <circle cx={`${(index / (data.length - 1)) * 100}%`} cy={`${getY(item.potassio, maxK)}%`} r="3" fill="#8B5CF6" />
                            </g>
                        ))}
                    </svg>
                    {/* Labels do eixo X */}
                    <div className="absolute -bottom-6 w-full flex justify-between text-xs text-gray-600">
                        {data.map((item, index) => (
                            <span key={index}>{item.mes}</span>
                        ))}
                    </div>
                </div>
                <div className="flex justify-center mt-6 space-x-4 text-xs">
                    <div className="flex items-center"><div className="w-3 h-3 bg-blue-500 mr-1"></div>pH</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-green-500 mr-1"></div>Fósforo</div>
                    <div className="flex items-center"><div className="w-3 h-3 bg-purple-500 mr-1"></div>Potássio</div>
                </div>
            </div>
        );
    };

    // Aba 2: Gráficos Comparativos
    const renderGraficosTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Filtros para Gráficos
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <CustomInput
                        type="select"
                        label="Cultura"
                        placeholder="Selecione a cultura"
                        options={[
                            { label: 'Milho', value: 'milho' },
                            { label: 'Feijão', value: 'feijao' },
                            { label: 'Soja', value: 'soja' },
                            { label: 'Mandioca', value: 'mandioca' }
                        ]}
                    />

                    <CustomInput
                        type="select"
                        label="Província"
                        placeholder="Selecione a província"
                        options={[
                            { label: 'Luanda', value: 'luanda' },
                            { label: 'Huambo', value: 'huambo' },
                            { label: 'Benguela', value: 'benguela' }
                        ]}
                    />

                    <CustomInput
                        type="date"
                        label="Data Inicial"
                        iconStart={<Calendar size={18} />}
                    />

                    <CustomInput
                        type="date"
                        label="Data Final"
                        iconStart={<Calendar size={18} />}
                    />
                </div>
            </div>

            {/* Cards de Gráficos com Visualizações */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold">Solo por Cultura</h4>
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <BarChart data={dadosGraficos.soloPorCultura} title="Parâmetros por Cultura" />
                    <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Resumo:</strong> Milho apresenta melhor equilíbrio nutricional (45 amostras)
                    </div>
                    <button
                        onClick={() => showToast('success', 'Gráfico Gerado', 'Gráfico de barras exportado com sucesso!')}
                        className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Exportar Gráfico
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold">Solo por Região</h4>
                        <PieChart className="w-5 h-5 text-green-600" />
                    </div>
                    <PieChart data={dadosGraficos.soloPorRegiao} title="Distribuição por Província" />
                    <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Resumo:</strong> Luanda concentra 35% das análises (67 amostras)
                    </div>
                    <button
                        onClick={() => showToast('success', 'Gráfico Gerado', 'Gráfico de pizza exportado com sucesso!')}
                        className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Exportar Gráfico
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-md font-semibold">Evolução Temporal</h4>
                        <LineChart className="w-5 h-5 text-purple-600" />
                    </div>
                    <LineChart data={dadosGraficos.evolucaoTemporal} title="Tendência dos Parâmetros (2025)" />
                    <div className="mt-4 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                        <strong>Resumo:</strong> pH e K mostram tendência crescente, P estável
                    </div>
                    <button
                        onClick={() => showToast('success', 'Gráfico Gerado', 'Gráfico de linha exportado com sucesso!')}
                        className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Exportar Gráfico
                    </button>
                </div>
            </div>
        </div>
    );

    // Aba 3: Histórico de Análises
    const renderHistoricoTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <History className="w-5 h-5 mr-2 text-orange-600" />
                    Filtros do Histórico
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <CustomInput
                        type="text"
                        label="Nome do Produtor"
                        placeholder="Buscar por produtor"
                        iconStart={<Search size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Código da Amostra"
                        placeholder="Ex: SL-2025-0001"
                        iconStart={<Search size={18} />}
                    />

                    <CustomInput
                        type="date"
                        label="Data Inicial"
                        iconStart={<Calendar size={18} />}
                    />

                    <CustomInput
                        type="date"
                        label="Data Final"
                        iconStart={<Calendar size={18} />}
                    />
                </div>
                {/* Tabela do Histórico */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-5">
                    <h3 className="text-lg font-semibold mb-4">Histórico de Análises</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produtor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Parâmetro</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Técnico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {historicoData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.produtor}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.codigoAmostra}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.parametro}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.valorObtido} {item.unidade}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.metodo}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(item.dataAnalise).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'Dentro do padrão' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{item.tecnico}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => showToast('info', 'Exportar', 'Exportando histórico para Excel')}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Exportar Excel
                    </button>
                </div>
            </div>


        </div>
    );

    // Aba 4: Gestão de Faturas
    const renderFaturasTab = () => (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Receipt className="w-5 h-5 mr-2 text-indigo-600" />
                    Gestão de Faturas
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <CustomInput
                        type="text"
                        label="Número da Fatura"
                        placeholder="Ex: FPN.2025.0001"
                        iconStart={<Search size={18} />}
                    />

                    <CustomInput
                        type="text"
                        label="Cliente"
                        placeholder="Nome do cliente"
                        iconStart={<User size={18} />}
                    />

                    <CustomInput
                        type="select"
                        label="Tipo"
                        placeholder="Tipo de fatura"
                        options={[
                            { label: 'Pro-forma', value: 'PRO_FORMA' },
                            { label: 'Final', value: 'FINAL' }
                        ]}
                    />

                    <CustomInput
                        type="select"
                        label="Status"
                        placeholder="Status da fatura"
                        options={[
                            { label: 'Pendente', value: 'PENDENTE' },
                            { label: 'Pago', value: 'PAGO' },
                            { label: 'Vencido', value: 'VENCIDO' }
                        ]}
                    />
                </div>
                {/* Tabela de Faturas */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-5">
                    <h3 className="text-lg font-semibold mb-4">Faturas Emitidas</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amostra</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {faturasData.map((fatura) => (
                                    <tr key={fatura.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{fatura.numero}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{fatura.cliente}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{fatura.codigoAmostra}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{getTipoFaturaText(fatura.tipo)}</td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                            {fatura.valorTotal.toLocaleString()} Kz
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeFatura(fatura.status)}`}>
                                                {fatura.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(fatura.dataEmissao).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex space-x-2">
                                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => showToast('success', 'Fatura Gerada', 'Nova fatura pro-forma foi gerada!')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <Download className="w-4 h-4 mr-2" />
                         Exportar Excel
                    </button>
                </div>
            </div>


        </div>
    );

    const tabs = [
        { id: 'laudos', label: 'Laudos Técnicos', icon: FileText, color: 'blue' },
        { id: 'graficos', label: 'Gráficos Comparativos', icon: BarChart3, color: 'green' },
        { id: 'historico', label: 'Histórico de Análises', icon: History, color: 'orange' },
        { id: 'faturas', label: 'Gestão de Faturas', icon: Receipt, color: 'indigo' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'laudos':
                return renderLaudosTab();
            case 'graficos':
                return renderGraficosTab();
            case 'historico':
                return renderHistoricoTab();
            case 'faturas':
                return renderFaturasTab();
            default:
                return renderLaudosTab();
        }
    };

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />

            {/* Estatísticas */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Laudos Gerados</p>
                            <p className="text-2xl font-bold text-gray-900">{laudosData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Análises Realizadas</p>
                            <p className="text-2xl font-bold text-gray-900">{historicoData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <Receipt className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Faturas Emitidas</p>
                            <p className="text-2xl font-bold text-gray-900">{faturasData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Receita Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {faturasData.reduce((total, f) => total + f.valorTotal, 0).toLocaleString()} Kz
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 p-6 text-white rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Relatórios e Laudos</h1>
                            <p className="text-indigo-100 mt-1">Gere laudos técnicos, gráficos comparativos, históricos de análises e controle de faturação</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => showToast('info', 'Exportar', 'Exportando relatório geral')}
                                className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar Relatório
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-gray-200 bg-white">
                    <div className="flex space-x-8 px-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${isActive
                                        ? `border-${tab.color}-500 text-${tab.color}-600`
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 mr-2 ${isActive ? `text-${tab.color}-600` : 'text-gray-400'}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default GestaoRelatoriosLaudos;