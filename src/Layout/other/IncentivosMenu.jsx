import { Banknote, Calculator, Check, Info, Split, TrendingDown, TrendingUp, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';
import AtribuicaoIncentivos from '../../modules/Agricola/pages/incentivo/AtribuicaoIncentivos';
import CadastroIncentivos from '../../modules/Agricola/pages/incentivo/CadastroIncentivos ';
import GestaoIncentivos from '../../modules/Agricola/pages/incentivo/GestaoIncentivos';
import ReembolsoIncentivos from '../../modules/Agricola/pages/incentivo/ReembolsoIncentivos';


const IncentivoMenu = () => {
    const [activeSection, setActiveSection] = useState('gestao');

    const [showInfoModal, setShowInfoModal] = useState(false);



    const menuItems = [
        {
            id: 'gestao',
            title: 'Gestão',
            icon: Users,
            description: 'Visualizar Todos',
            color: 'green'
        },
        {
            id: 'cadastro',
            title: 'Cadastrar',
            icon: UserPlus,
            description: 'Novo Incentivo',
            color: 'blue'
        },
        {
            id: 'distribuicao',
            title: 'Distribuir',
            icon: Split,
            description: 'Realizar Distribuição',
            color: 'blue'
        },
        {
            id: 'reembolso',
            title: 'Reembolsar',
            icon: Banknote,
            description: 'Realizar Reembolso',
            color: 'blue'
        },
    ];

    const getColorClasses = (color, isActive) => {
        const classes = {
            blue: {
                button: isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300',
                icon: isActive ? 'text-white' : 'text-blue-600',
                badge: 'bg-blue-100 text-blue-800'
            },
            green: {
                button: isActive
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300',
                icon: isActive ? 'text-white' : 'text-blue-600',
                badge: 'bg-blue-100 text-blue-800'
            }
        };
        return classes[color] || classes.blue;
    };

    const renderContent = () => {
        switch (activeSection) {

            case 'gestao':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                            <GestaoIncentivos />
                        </div>
                    </div>
                );

            case 'cadastro':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="">
                            <CadastroIncentivos />
                        </div>
                    </div>
                );

            case 'distribuicao':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="">
                            <AtribuicaoIncentivos />
                        </div>
                    </div>
                );

            case 'reembolso':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center">
                            <ReembolsoIncentivos />
                        </div>
                    </div>
                );


            default:
                return null;
        }


    };



    return (
        <div>

            <div className="min-h-full p-3 ">

                {/* Menu de Navegação */}
                <div className="mb-8 flex justify-between">
                    <div className="flex flex-wrap gap-4">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;
                            const colorClasses = getColorClasses(item.color, isActive);

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center px-6 py-4 rounded-lg border-2 transition-all duration-200 ${colorClasses.button}`}
                                >
                                    <Icon className={`w-6 h-6 mr-3 ${colorClasses.icon}`} />
                                    <div className="text-left">
                                        <div className="font-semibold">{item.title}</div>
                                        <div className="text-sm opacity-75">{item.description}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                    {/* Botão de informações com tooltip */}
                    <div className="flex justify-center  group">
                        <button
                            onClick={() => setShowInfoModal(true)}
                            className="flex items-center text-center h-10 px-2 py-2 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors shadow-sm"

                        >
                            <Info className="w-5 h-5" />
                        </button>
                        {/* Tooltip */}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-0 -translate-x-1/2 bg-blue-100 text-blue-600 text-xs rounded px-2 py-1 pointer-events-none whitespace-nowrap z-50 shadow-lg">
                            Informações sobre a página
                        </span>
                    </div>

                </div>

                {/* Conteúdo da Seção Ativa */}
                <div className="transition-all duration-300">
                    {renderContent()}
                </div>
            </div>

            {/* Modal de Informações do SIGAF */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white p-8 rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-end">

                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        {/* Conteúdo dinâmico do modal */}
                        {activeSection === 'cadastro' && (

                            <div>
                                <div className="flex items-center text-blue-700 mb-4">
                                    <Calculator size={20} className="mr-3" />
                                    <h2 className="text-2xl font-bold">Sobre os Incentivos e Reembolsos</h2>
                                </div>
                                <p className="text-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg mb-3">Objetivo dos Incentivos:</h4>
                                            <p className="leading-relaxed text-base">
                                                Os incentivos visam apoiar os produtores agrícolas e pecuários no desenvolvimento de suas
                                                atividades, fornecendo recursos financeiros ou produtos necessários para aumentar a produtividade.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800 mb-3">Sistema de Reembolso:</h4>
                                            <p className="leading-relaxed text-base mb-3">
                                                O sistema de reembolso permite que uma porcentagem do valor total do incentivo seja
                                                devolvida ao governo, calculando automaticamente o valor líquido que o produtor receberá.
                                            </p>
                                            <ul className="space-y-2 text-base leading-relaxed">
                                                <li className="flex items-start">
                                                    <Calculator size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Cálculo automático do reembolso
                                                </li>
                                                <li className="flex items-start">
                                                    <TrendingUp size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Valor líquido para o produtor
                                                </li>
                                                <li className="flex items-start">
                                                    <TrendingDown size={16} className="text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Percentual de reembolso configurável
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </p>
                            </div>

                        )}
                        {activeSection === 'distribuicao' && (
                            <div>
                                <div className="flex items-center text-blue-700 mb-4">
                                    <Calculator size={20} className="mr-3" />
                                    <h2 className="text-2xl font-bold">Sobre a Distribuição de Incentivos</h2>
                                </div>
                                <p className="text-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800 mb-3">Processo de Atribuição:</h4>
                                            <p className="leading-relaxed text-base">
                                                O sistema permite atribuir incentivos pré-cadastrados a grupos de produtores de forma
                                                eficiente e organizada, garantindo o controle total sobre distribuição e custos.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800 mb-3">Funcionalidades:</h4>
                                            <ul className="space-y-2 text-base leading-relaxed">
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Seleção múltipla de produtores
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Incentivos pré-cadastrados com dados automáticos
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Cálculo automático de totais
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Controle de prioridades e entregas
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </p>
                            </div>
                        )}
                        {activeSection === 'reembolso' && (
                            <div>
                                <div className="flex items-center text-blue-700 mb-4">
                                    <TrendingDown size={20} className="mr-3" />
                                    <h2 className="text-2xl font-bold">Sobre o Reembolso</h2>
                                </div>
                                <p className="text-gray-700 text-base">
                                    O reembolso permite calcular e registrar a devolução de parte dos valores dos incentivos, conforme as regras do programa.
                                </p>
                            </div>
                        )}
                        {activeSection === 'gestao' && (
                            <div>
                                <div className="flex items-center text-blue-700 mb-4">
                                    <Info size={20} className="mr-3" />
                                    <h2 className="text-2xl font-bold text-blue-700">Gestão de Incentivos</h2>
                                </div>
                                <p className="text-gray-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-lg mb-3">Processo de Reembolso:</h4>
                                            <p className="leading-relaxed text-base">
                                                O sistema permite processar reembolsos de incentivos já atribuídos aos produtores,
                                                calculando automaticamente o valor baseado nas percentagens pré-definidas para cada tipo de incentivo.
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="font-bold text-lg text-gray-800 mb-3">Funcionalidades:</h4>
                                            <ul className="space-y-2 leading-relaxed text-base">
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Seleção individual de produtores
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Visualização de incentivos recebidos
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Cálculo automático de valores
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Controle de motivos e prioridades
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

        </div>

    );
};

export default IncentivoMenu;