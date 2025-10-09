import { UserPlus, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import CadastroPragas from './CadastroPragas';
import DashboardControlePragas from './DashboardControlePragas';
import GestaoPragas from './GestaoPragas';



const ControlePragasMenu = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('dashboard');

    // Detectar edição automática
    useEffect(() => {
        if (location.state?.projetoEditando) {
            setActiveSection('cadastro');
        }
    }, [location.state]);

    const menuItems = [
        {
            id: 'dashboard',
            title: 'Dashboard',
            icon: Users,
            description: 'Dashboard de Pragas',
            color: 'green'
        },
        {
            id: 'gestao',
            title: 'Gestão',
            icon: Users,
            description: 'Visualizar e gerenciar',
            color: 'green'
        },
        {
            id: 'cadastro',
            title: 'Cadastrar',
            icon: UserPlus,
            description: 'Registrar Nova',
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
                            <GestaoPragas />
                        </div>
                    </div>
                );

            case 'cadastro':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="">
                            <CadastroPragas initialData={location.state?.projetoEditando} />
                        </div>
                    </div>
                );
            case 'dashboard':
                return (
                    <div className="bg-white rounded-lg shadow-sm">
                        <div className="text-center">
                            <DashboardControlePragas initialData={location.state?.projetoEditando} />
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

export default ControlePragasMenu;