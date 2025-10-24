import { Info, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';
import GestaoInfraestruturaFlorestal from '../pages/infraestrutura/infraestruturaDeApoio/GestaoInfraestruturaFlorestal';
import RegistroInfraestruturaFlorestal from '../pages/infraestrutura/infraestruturaDeApoio/RegistroInfraestruturaFlorestal';




const MenuInfraestruturaFlorestal = () => {
    const [activeSection, setActiveSection] = useState('gestao');
    const [showInfoModal, setShowInfoModal] = useState(false);



    const menuItems = [
        {
            id: 'gestao',
            title: 'Gestão Apoio Agrícola',
            icon: Users,
            description: 'Visualizar Apoio Agrícola',
            color: 'green'
        },
        {
            id: 'cadastro',
            title: 'Registrar Apoio Agrícola',
            icon: UserPlus,
            description: 'Registrar novo Apoio Agrícola',
            color: 'blue'
        }
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
                    <div className="bg-white rounded-lg shadow-sm ">
                        <div className="text-center">
                            <GestaoInfraestruturaFlorestal />
                        </div>
                    </div>
                );
            case 'cadastro':
                return (
                    <div className="bg-white  shadow-sm ">
                        <div className="text-center">
                            <RegistroInfraestruturaFlorestal />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>

            <div className="min-h-full ">


                {/* Menu de Navegação */}
                <div className="mb-8">
                    <div className="flex justify-between">
                        <div className='flex gap-4'>
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


                </div>

                {/* Conteúdo da Seção Ativa */}
                <div className="transition-all duration-300">
                    {renderContent()}
                </div>

                {/* Modal de Informações do SIGAF */}
                {showInfoModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center text-blue-700">
                                    <Info className="w-6 h-6 mr-3" />
                                    <h2 className="text-2xl font-bold text-blue-700">Sobre o SIGAF</h2>
                                </div>
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                            {activeSection === 'cadastro' ? (
                                <div className="w-full ">
                                    <div className="grid grid-cols-1  md:grid-cols-2 gap-8 items-start mb-6">
                                        <div className="text-center md:text-left ">
                                            <h3 className="font-bold text-lg mb-2">Objetivo:</h3>
                                            <p className="text-gray-700 text-base leading-relaxed">
                                                O Registo Nacional de Produtores Agrícolas visa criar uma base de dados abrangente dos produtores agrícolas em Angola, facilitando o planejamento de políticas públicas e a distribuição eficiente de recursos.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg mb-2">Benefícios:</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Acesso a programas de assistência técnica</li>
                                                <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Facilitação de crédito agrícola</li>
                                                <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Participação em projetos de desenvolvimento</li>
                                                <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Recebimento de insumos e equipamentos</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
                                        <span className="font-bold text-blue-700">Proteção de Dados: </span>
                                        <span className="text-blue-700">Todas as informações fornecidas são confidenciais e serão utilizadas exclusivamente para fins de políticas públicas agrícolas, conforme a <a href='https://www.angola.gov.ao/ao/lei-protecao-dados-pessoais' target='_blank' rel='noopener noreferrer' className='underline font-semibold'>Lei de Proteção de Dados Pessoais de Angola</a>.</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Actividades Registadas:</h3>
                                        <ul className="space-y-1 text-base text-gray-600">
                                            <li>• Agricultura</li>
                                            <li>• Pecuária</li>
                                            <li>• Aquicultura e Piscicultura</li>
                                            <li>• Agropecuária</li>
                                            <li>• Produtos Florestais</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Estado dos Processos:</h3>
                                        <ul className="space-y-1 text-base text-gray-600">
                                            <li>• <span className="text-blue-600">Processo Recebido:</span> Registo inicial</li>
                                            <li>• <span className="text-yellow-600">Pendente:</span> Em análise</li>
                                            <li>• <span className="text-blue-600">Aprovado:</span> Activo no SIGAF</li>
                                            <li>• <span className="text-red-600">Rejeitado:</span> Não aprovado</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">Benefícios do Cadastro:</h3>
                                        <ul className="space-y-1 text-base text-gray-600">
                                            <li>• Acesso a programas governamentais</li>
                                            <li>• Facilitação de crédito agrícola</li>
                                            <li>• Assistência técnica</li>
                                            <li>• Distribuição de insumos</li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MenuInfraestruturaFlorestal;