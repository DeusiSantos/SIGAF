import { Check, Info, UserPlus, Users, X } from 'lucide-react';
import { useState } from 'react';

import AssociasoesRurais from '../../pages/SociedadeAgricola/AssociasoesRurais';
import GestaoAssociacaoRurais from '../../pages/SociedadeAgricola/GestaoAssociacaoRurais';


const GestaoProgramasBeneficiosMenu = () => {
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
            description: 'Registrar novo',
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
                            <GestaoAssociacaoRurais />
                        </div>
                    </div>
                );

            case 'cadastro':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="">
                            <AssociasoesRurais />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-full">

            {/* Menu de Navegação */}
            <div className="mb-8">

                <div className="flex justify-between">
                    <div className='flex flex-wrap gap-4'>
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
                    <div>
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
                            <div className="flex items-center text-blue-700 pt-3" >
                                <Info className="w-6 h-6 mr-3" />
                                <h2 className="text-2xl font-bold text-blue-700">Sobre o Registro do Associado</h2>
                            </div>
                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        {activeSection === 'gestao' ? (
                            <div className="w-full ">

                                <p className='text-lg'>Nenhuma informação para esta página</p>
                            </div>
                        ) : (
                            <div>
                                {/* Information Card */}
                                <div className="mt-8 bg-white p-3 shadow-sm ">


                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
                                        <div>
                                            <h4 className="font-semibold text-gray-800 text-lg mb-3">Objetivo:</h4>
                                            <p className="leading-relaxed  text-base">O registro do Associado agrícolas e agropecuárias visa formalizar e fortalecer as organizações produtivas, facilitando o acesso a programas governamentais, crédito e assistência técnica.</p>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold text-gray-800 mb-3 text-lg">Benefícios:</h4>
                                            <ul className="space-y-2 leading-relaxed text-base">
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Acesso facilitado a programas de financiamento
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Participação em projetos de desenvolvimento
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Assistência técnica especializada
                                                </li>
                                                <li className="flex items-start">
                                                    <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    Apoio na comercialização de produtos
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                        <p className="text-blue-700 text-base leading-relaxed">
                                            <strong>Confidencialidade:</strong> Todas as informações fornecidas são tratadas com confidencialidade e utilizadas exclusivamente para fins de desenvolvimento do setor agrícola Associativo.
                                        </p>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestaoProgramasBeneficiosMenu;