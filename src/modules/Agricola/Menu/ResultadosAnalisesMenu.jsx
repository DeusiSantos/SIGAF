import { FileInput, FileSearch } from 'lucide-react';
import { useState } from 'react';
import LancamentoResultados from '../pages/LaboratorioDeSolo/ResultadosAnalises/LancamentoResultados';
import GestaoResultadosAnalises from '../pages/LaboratorioDeSolo/ResultadosAnalises/GestaoResultadosAnalises';

const ResultadosAnalisesMenu = () => {
    const [activeSection, setActiveSection] = useState('lancamento');

    const menuItems = [
        {
            id: 'consulta',
            title: 'Gestão de Resultados',
            icon: FileSearch,
            description: 'Consultar e editar resultados de análises',
            color: 'blue'
        },
        {
            id: 'lancamento',
            title: 'Lançamento de Resultados',
            icon: FileInput,
            description: 'Registrar novos resultados de análises',
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
            case 'consulta':
                return <GestaoResultadosAnalises />

            case 'lancamento':
                return <LancamentoResultados/>

            default:
                return null;
        }
    };

    return (
        <div className="min-h-full">
            {/* Menu de Navegação */}
            <div className="mb-8">
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
            </div>

            {/* Conteúdo da Seção Ativa */}
            <div className="transition-all duration-300">
                {renderContent()}
            </div>
        </div>
    );
};

export default ResultadosAnalisesMenu;