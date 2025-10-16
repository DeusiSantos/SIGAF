import { Users, UserPlus } from 'lucide-react';
import { useState } from 'react';
import CadastroDeSolo from '../pages/LaboratorioDeSolo/AmostraDeSolo/CadastroDeSolo';
import GestaoAmostrasDeSolo from '../pages/LaboratorioDeSolo/AmostraDeSolo/GestaoAmostrasDeSolo';

const AmostraSoloMenu = () => {
    const [activeSection, setActiveSection] = useState('cadastro');

    const menuItems = [
        {
            id: 'gestao',
            title: ' Gestão de Amostras',
            icon: Users,
            description: 'Gerenciar amostras de solo existentes',
            color: 'blue'
        },
        {
            id: 'cadastro',
            title: 'Cadastrar Amostra de Solo',
            icon: UserPlus,
            description: 'Registrar nova amostra de solo',
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
                return <GestaoAmostrasDeSolo />;
            case 'cadastro':
               return <CadastroDeSolo />;

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

export default AmostraSoloMenu;