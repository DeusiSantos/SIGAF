import { CheckCircle, Info, UserPlus, Users, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CadastroProjetos from '../../modules/Agricola/pages/ProgramaBeneficio/CadastroProjetos';
import GestaoProjetos from '../../modules/Agricola/pages/ProgramaBeneficio/GestaoProjetos';



const GestaoProgramasBeneficiosMenu = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('gestao');
    const [showInfoModal, setShowInfoModal] = useState(false);

    // Detectar edição automática
    useEffect(() => {
        if (location.state?.projetoEditando) {
            setActiveSection('cadastro');
        }
    }, [location.state]);

    const menuItems = [
        {
            id: 'gestao',
            title: 'Gestão ',
            icon: Users,
            description: 'Visualizar todos',
            color: 'green'
        },
        {
            id: 'cadastro',
            title: 'Cadastrar ',
            icon: UserPlus,
            description: 'Novo Projeto',
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
                    <div className="bg-white  shadow-sm ">
                        <div className="text-center">
                            <GestaoProjetos />
                        </div>
                    </div>
                );

            case 'cadastro':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="text-center">
                            <CadastroProjetos initialData={location.state?.projetoEditando} />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-full shadow-sm">

            {/* Menu de Navegação */}
            <div className="mb-8 ">
                <div className="flex flex-wrap gap-4 justify-between">
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

            {/* Modal de Informações do RNPA */}
            {showInfoModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center text-blue-700">
                                <Info className="w-6 h-6 mr-3" />
                                <h2 className="text-2xl font-bold text-blue-700">Sistema de Gestão de Projectos Agrícolas</h2>
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
                                    <div>
                                        <h4 className="font-bold text-lg mb-2"> Tipos de Dados:</h4>
                                        <div className="text-sm font-mono pl-4">
                                            <div className="space-y-2">
                                                <div><strong>NomeProjeto:</strong> <span className="text-blue-600">string</span></div>
                                                <div><strong>NumeroBeneficiarios:</strong> <span className="text-blue-600">string</span></div>
                                                <div><strong>FaseProjeto:</strong> <span className="text-blue-600">string</span></div>
                                                <div><strong>ValorGlobalProjeto:</strong> <span className="text-blue-600">string</span></div>
                                                <div><strong>ProvinciasAbrangidas:</strong> <span className="text-green-600">array</span></div>
                                                <div><strong>entidadeImplementadora:</strong> <span className="text-blue-600">string</span></div>
                                                <div><strong>tipoCredito:</strong> <span className="text-green-600">array</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-4 text-lg">✅ Validações:</h4>
                                        <ul className="space-y-2 text-sm">
                                            <li className="flex items-start">
                                                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                Todos os campos são obrigatórios
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                Número de beneficiários deve ser válido
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                Valor do projeto deve ser positivo
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                Pelo menos uma província obrigatória
                                            </li>
                                            <li className="flex items-start">
                                                <CheckCircle size={16} className="text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                                                Pelo menos um tipo de apoio obrigatório
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
                                    <span className="font-bold text-blue-700">💡 Importante:</span>
                                    <span className='text-blue-700'> Este formulário segue a especificação exata de tipos de dados fornecida, mantendo números como strings conforme solicitado. Os dados são validados antes do envio para garantir a integridade das informações.</span>

                                </div>
                            </div>
                        ) : (


                            <div className="w-full ">
                                <div className="grid grid-cols-1  md:grid-cols-2 gap-8 items-start mb-6">
                                    <div className="text-center md:text-left ">
                                        <h3 className="font-bold text-lg mb-2">Objetivo:</h3>
                                        <p className="text-gray-700 text-base leading-relaxed">
                                            O sistema permite o acompanhamento integral dos projectos de desenvolvimento agrícola em Angola, desde o planeamento até a conclusão, garantindo transparência e eficiência na gestão dos recursos.
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Principais Funcionalidades:</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Registo e gestão completa de projectos</li>
                                            <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Acompanhamento de progresso em tempo real</li>
                                            <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Controle financeiro e de beneficiários(as)</li>
                                            <li className="flex items-center text-gray-700"><span className="text-green-600 mr-2"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2'><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></svg></span> Relatórios e estatísticas detalhadas</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="  mt-2  mb-4">
                                    <span className="font-bold text-lg mb-3">Entidades Parceiras: </span>
                                    <ul className="space-y-2 leading-relaxed">
                                        <li className="flex items-start">
                                            <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            FADA - Fundo de Apoio ao Desenvolvimento Agrário
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            PDAC - Programa de Desenvolvimento da Agricultura Comercial
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            MOSAP - Programa de Apoio aos Pequenos Produtores
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            FRESAN - Fortalecimento da Resiliência e Segurança Alimentar
                                        </li>
                                        <li className="flex items-start">
                                            <CheckCircle size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                                            KWENDA - Programa de Apoio ao Desenvolvimento Rural
                                        </li>
                                    </ul>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
                                    <span className="font-bold text-blue-700">Transparência: </span>
                                    <span className='text-blue-700'>Todos os dados dos projectos são gerenciados com transparência e responsabilidade, contribuindo para o desenvolvimento sustentável do setor agrícola angolano e o bem-estar das comunidades rurais.</span>

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