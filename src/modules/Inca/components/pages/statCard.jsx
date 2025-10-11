import React from 'react';

/**
 * Componente de card de estatística reutilizável
 * 
 * @param {React.ComponentType} icon - Ícone do lucide-react
 * @param {string} iconBgColor - Cor de fundo do ícone (ex: 'blue-100')
 * @param {string} iconColor - Cor do ícone (ex: 'blue-600')
 * @param {string} label - Label/título da estatística (ex: 'Total')
 * @param {string|number} value - Valor da estatística
 */
const StatCard = ({ 
  icon: Icon, 
  iconBgColor = 'blue-100',
  iconColor = 'blue-600',
  label,
  value
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 bg-${iconBgColor} rounded-full`}>
          <Icon className={`w-6 h-6 text-${iconColor}`} />
        </div>
        <div className="flex flex-col items-center ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;