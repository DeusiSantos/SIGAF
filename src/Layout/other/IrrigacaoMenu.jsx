import React, { useState } from 'react';
import { UserPlus, Users, FileText, User, MapPin, Award } from 'lucide-react';

import CadastroProdutor from '../../pages/CadastroProdutor';
import ProdutoresGestao from '../../pages/ProdutoresGestao';
import CadastroCooperativa from '../../pages/SociedadeAgricola/EntidadesAssociativasCadastro';
import AssociasoesRurais from '../../pages/SociedadeAgricola/AssociasoesRurais';
import CadastroProjetos from '../../pages/Programas-e-Benefícios/CadastroProjetos';
import ValidarCerficacao from '../../pages/Validação e Certifica/validarCerficacao';
import CertificadosGestao from '../../pages/CertificadosGestao';
import CadastroFontesAgua from '../../pages/InfraEstrutura/CadastroFontesAgua';
import GestaoSistemasIrrigacao from '../../pages/InfraEstrutura/GestaoSistemasIrrigacao';

const IrrigacaoMenu = () => {
    const [activeSection, setActiveSection] = useState('cadastro');

    const menuItems = [
         {
            id: 'gestao',
            title: 'Gestão de Sistema',
            icon: Users,
            description: 'Gerenciar Infraestrutura',
            color: 'green'
        },
        {
            id: 'cadastro',
            title: 'Cadastrar Infraestrutura',
            icon: UserPlus,
            description: 'Nova Infraestrutura',
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
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center">
                            <GestaoSistemasIrrigacao />
                        </div>
                    </div>
                );

            case 'cadastro':
                return (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <div className="text-center">
                            <CadastroFontesAgua />
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

export default IrrigacaoMenu;